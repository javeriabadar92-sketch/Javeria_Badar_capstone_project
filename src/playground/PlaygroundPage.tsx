import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Modal } from './ModalComponent.tsx';
import { Tabs } from './Tabs.tsx';
import { Disclosure } from './Disclosure.tsx';
import PageHeader from '../components/PageHeader';

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    { id: 'one', label: 'ML Models', content: <p className="text-base leading-relaxed">Train and deploy machine learning models with optimized inference pipelines</p> },
    { id: 'two', label: 'Data Pipeline', content: <p className="text-base leading-relaxed">Build scalable data processing workflows for AI training and inference</p> },
    { id: 'three', label: 'API Integration', content: <p className="text-base leading-relaxed">Connect AI models to applications via REST and WebSocket protocols</p> },
  ];

  return (
    <div className="page-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <PageHeader
          eyebrow="Component lab"
          icon={MessageSquare}
          title={<>AI Development <span className="text-cyan-600">Hub</span></>}
          subtitle="Interact with AI components and explore machine learning workflows"
        />

        {/* Modal Section */}
        <section className="surface-card p-5 sm:p-8">
          <h2 className="text-xl font-semibold text-cyan-700 sm:text-2xl">
            Model Configuration
          </h2>
          <p className="page-subtitle mb-6">
            Configure AI model parameters and adjust hyperparameters for optimal performance
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="focus-ring rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-black/20 transition-colors hover:bg-primary/85"
          >
            Configure Model
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Model Settings"
          >
            <p className="text-slate-700">
              Set learning rate, batch size, and other training parameters.
            </p>
            <input 
              type="text" 
              placeholder="Enter learning rate..." 
              className="focus-ring w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder:text-slate-500" 
            />
          </Modal>
        </section>

        {/* Tabs Section */}
        <section className="surface-card p-5 sm:p-8">
          <h2 className="text-xl font-semibold text-cyan-700 sm:text-2xl">
            Development Workflow
          </h2>
          <p className="page-subtitle mb-6">
            Explore different stages of AI model development and deployment
          </p>
          <Tabs tabs={tabsData} />
        </section>

        {/* Disclosure Section */}
        <section className="surface-card p-5 sm:p-8">
          <h2 className="text-xl font-semibold text-cyan-700 sm:text-2xl">
            AI Fundamentals
          </h2>
          <p className="page-subtitle mb-6">
            Key concepts and techniques in modern AI development
          </p>
          <div className="space-y-4">
            <Disclosure title="Neural Networks Basics">
              <p className="leading-relaxed text-slate-700">
                Deep neural networks learn hierarchical representations of data through multiple layers of neurons. Training involves backpropagation to minimize loss and optimize weights efficiently.
              </p>
            </Disclosure>
            <Disclosure title="Transformer Architecture">
              <p className="leading-relaxed text-slate-700">
                Transformers use attention mechanisms to process sequential data in parallel. They power modern large language models and have revolutionized NLP applications globally.
              </p>
            </Disclosure>
            <Disclosure title="Model Optimization">
              <p className="leading-relaxed text-slate-700">
                Quantization, pruning, and knowledge distillation reduce model size for faster inference. Optimization techniques enable deployment on edge devices and reduce computational costs.
              </p>
            </Disclosure>
          </div>
        </section>

      </div>
    </div>
  );
}