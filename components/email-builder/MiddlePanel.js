"use client";

import { useSelector, useDispatch } from "react-redux";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentRenderer from "./ComponentRenderer";
import {
  selectComponent,
  setZoomLevel,
  setDevicePreview,
  toggleShowGrid,
  createNewTemplate,
  loadTemplate,
  addComponent,
} from "@/store/slices/emailBuilderSlice";
import { COMPONENT_TYPES } from "./componentLibrary";
import { v4 as uuidv4 } from "uuid";
import { useRef, forwardRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { generateEmailHTML } from "./htmlGenerator";

function EditorToolbar({ canvasRef }) {
  const dispatch = useDispatch();
  const {
    zoomLevel,
    devicePreview,
    showGrid,
    components,
    templateName,
    templateSubject,
    templateFrom,
    templateReplyTo,
  } = useSelector((state) => state.emailBuilder);

  const zoomLevels = [50, 75, 100, 125, 150];

  const handleSave = () => {
    const templateData = {
      templateName,
      templateSubject,
      templateFrom,
      templateReplyTo,
      components,
      createdAt: new Date().toISOString(),
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(templateData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName || "email-template"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const templateData = JSON.parse(e.target.result);

        // Load the template data into Redux
        dispatch(
          loadTemplate({
            templateName: templateData.templateName,
            templateSubject: templateData.templateSubject,
            templateFrom: templateData.templateFrom,
            templateReplyTo: templateData.templateReplyTo,
            components: templateData.components,
          })
        );
      } catch (error) {
        alert("Error loading template: Invalid JSON file");
        console.error("Error loading template:", error);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be loaded again
    event.target.value = "";
  };

  const handleExportPNG = async () => {
    try {
      // Generate clean HTML from components
      const html = generateEmailHTML(components, {
        templateName,
        templateSubject,
      });

      // Create a wrapper div to render the HTML
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.width = "640px"; // Slightly larger to accommodate the 600px table + padding
      wrapper.style.backgroundColor = "#f4f4f4";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Wait for images to load
      const images = wrapper.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            })
        )
      );

      // Small delay to ensure layout is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the inner email table (the 600px white table with the actual content)
      const emailTable = wrapper.querySelector('table[style*="width: 600px"]');

      if (!emailTable) {
        console.error("Could not find email content table");
        document.body.removeChild(wrapper);
        throw new Error("Could not find email content table");
      }

      // Get the actual dimensions of the table
      const tableRect = emailTable.getBoundingClientRect();
      const tableWidth = Math.ceil(tableRect.width);
      const tableHeight = Math.ceil(tableRect.height);

      console.log(
        "Email table actual dimensions:",
        tableWidth,
        "x",
        tableHeight
      );

      // Create a canvas with the exact dimensions we want
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = tableWidth;
      targetCanvas.height = tableHeight;

      // Capture the email table
      const capturedCanvas = await html2canvas(emailTable, {
        backgroundColor: "#ffffff",
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
        height: tableHeight,
      });

      console.log(
        "Final canvas dimensions:",
        capturedCanvas.width,
        "x",
        capturedCanvas.height
      );

      // Convert to blob and download
      capturedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${templateName || "email-template"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Clean up the wrapper
        document.body.removeChild(wrapper);
      });
    } catch (error) {
      alert("Error exporting image");
      console.error("Error exporting PNG:", error);
      // Clean up on error
      const wrapper = document.querySelector(
        'div[style*="position: fixed"][style*="-9999px"]'
      );
      if (wrapper) {
        document.body.removeChild(wrapper);
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(createNewTemplate())}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          New
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
        >
          Save
        </button>
        <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors cursor-pointer">
          Load
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            className="hidden"
          />
        </label>
        <button
          onClick={handleExportPNG}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
        >
          Export PNG
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Device Preview Selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
          {["desktop", "tablet", "mobile"].map((device) => (
            <button
              key={device}
              onClick={() => dispatch(setDevicePreview(device))}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                devicePreview === device
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {device}
            </button>
          ))}
        </div>

        {/* Zoom Control */}
        <select
          value={zoomLevel}
          onChange={(e) => dispatch(setZoomLevel(Number(e.target.value)))}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {level}%
            </option>
          ))}
        </select>

        {/* Grid Toggle */}
        <button
          onClick={() => dispatch(toggleShowGrid())}
          className={`px-3 py-2 text-sm rounded transition-colors ${
            showGrid
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Grid
        </button>
      </div>
    </div>
  );
}

const Canvas = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { components, selectedComponentId, zoomLevel, showGrid } = useSelector(
    (state) => state.emailBuilder
  );

  const { setNodeRef } = useDroppable({
    id: "email-canvas",
  });

  const canvasWidth = 600;
  const scaledWidth = (canvasWidth * zoomLevel) / 100;

  const addNewRow = (position) => {
    const newRow = {
      type: COMPONENT_TYPES.ROW,
      props: {
        columns: 1,
        padding: "10px",
      },
      children: [
        {
          id: uuidv4(),
          type: COMPONENT_TYPES.COLUMN,
          props: {
            width: "100%",
          },
          children: [],
          parentId: null,
        },
      ],
    };

    dispatch(
      addComponent({
        component: newRow,
        parentId: null,
        position: position,
      })
    );
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      <div
        ref={ref}
        className="mx-auto bg-white shadow-lg"
        style={{
          width: `${scaledWidth}px`,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
        }}
      >
        <div
          ref={setNodeRef}
          className={`${components.length === 0 ? "min-h-[600px]" : ""} ${
            showGrid ? "bg-grid-pattern" : ""
          }`}
          onClick={() => dispatch(selectComponent(null))}
        >
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 m-4">
              <div className="text-center text-gray-400">
                <svg
                  className="mx-auto w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-medium">Drag components here</p>
                <p className="text-sm">Start building your email template</p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {components.map((component, index) => (
                <div key={component.id} className="relative group">
                  {/* Add Row Above Button */}
                  <div
                    className="absolute left-0 right-0 top-0 flex items-center justify-center gap-2 pointer-events-none z-20"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewRow(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg flex items-center gap-1 transition-opacity"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Above
                    </button>
                  </div>

                  <ComponentRenderer
                    component={component}
                    isSelected={selectedComponentId === component.id}
                    onSelect={() => dispatch(selectComponent(component.id))}
                  />

                  {/* Add Row Below Button */}
                  <div
                    className="absolute left-0 right-0 bottom-0 flex items-center justify-center gap-2 pointer-events-none z-20"
                    style={{ transform: "translateY(50%)" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewRow(index + 1);
                      }}
                      className="opacity-0 group-hover:opacity-100 pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg flex items-center gap-1 transition-opacity"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Below
                    </button>
                  </div>
                </div>
              ))}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default function MiddlePanel() {
  const canvasRef = useRef(null);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar canvasRef={canvasRef} />
      <Canvas ref={canvasRef} />
    </div>
  );
}
