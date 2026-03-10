'use client';

import ParagraphWidget from './ParagraphWidget';
import TableWidget from './TableWidget';
import BulletsWidget from './BulletsWidget';
import ImageWidget from './ImageWidget';
import FormWidget from './FormWidget';
import TemplateBuilderWidget from './TemplateBuilderWidget';

export default function WidgetRenderer({ widget, onFormSubmit, onImageExpand }) {
  const { type, data } = widget;

  switch (type) {
    case 'paragraph':
      return <ParagraphWidget data={data} />;

    case 'table':
      return <TableWidget data={data} />;

    case 'bullets':
    case 'list':
      return <BulletsWidget data={data} />;

    case 'image':
      return <ImageWidget data={data} onExpand={onImageExpand} />;

    case 'form':
      return <FormWidget data={data} onSubmit={onFormSubmit} />;

    case 'template-builder':
      return <TemplateBuilderWidget data={data} onExpand={onImageExpand} />;

    default:
      return (
        <div className="bg-gray-800 rounded-lg p-4 mb-3">
          <p className="text-gray-400">Unsupported widget type: {type}</p>
        </div>
      );
  }
}
