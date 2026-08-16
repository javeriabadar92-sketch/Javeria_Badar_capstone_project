import { useState } from 'react';
import { Modal } from './ModalComponent.tsx';
import { Tabs } from './Tabs.tsx';
import { Disclosure } from './Disclosure.tsx';

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    { id: 'one', label: 'Tab One', content: <p>Content for tab one</p> },
    { id: 'two', label: 'Tab Two', content: <p>Content for tab two</p> },
    { id: 'three', label: 'Tab Three', content: <p>Content for tab three</p> },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Accessibility Playground</h1>

      <section>
        <h2 className="text-lg font-bold mb-2">Modal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p>This is the modal content. Try tabbing through it.</p>
          <input type="text" placeholder="Sample input" className="border p-2 mt-2 w-full" />
        </Modal>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Tabs</h2>
        <Tabs tabs={tabsData} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Disclosure</h2>
        <Disclosure title="Click to expand">
          <p>This content is hidden until expanded.</p>
        </Disclosure>
      </section>
    </div>
  );
}