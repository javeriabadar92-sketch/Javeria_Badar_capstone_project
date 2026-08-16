import { useState } from 'react';
import { Modal } from './ModalComponent.tsx';
import { Tabs } from './Tabs.tsx';
import { Disclosure } from './Disclosure.tsx';

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    { id: 'one', label: 'ML Models', content: <p className="font-roboto text-base leading-relaxed">Train and deploy machine learning models with optimized inference pipelines</p> },
    { id: 'two', label: 'Data Pipeline', content: <p className="font-openSans text-base leading-relaxed">Build scalable data processing workflows for AI training and inference</p> },
    { id: 'three', label: 'API Integration', content: <p className="font-inter text-base leading-relaxed">Connect AI models to applications via REST and WebSocket protocols</p> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-roboto text-4xl font-bold text-white mb-3 tracking-tight">
            AI Development Hub
          </h1>
          <h2 className="font-openSans text-xl text-indigo-400 font-semibold mb-4 tracking-wide">
            Accessible Components
          </h2>
          <p className="font-openSans text-lg text-slate-300 font-light tracking-wide">
            Interact with AI components and explore machine learning workflows
          </p>
        </div>

        {/* Modal Section */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-colors duration-300">
          <h2 className="font-inter text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            Model Configuration
          </h2>
          <p className="font-openSans text-slate-400 text-sm mb-6 leading-relaxed">
            Configure AI model parameters and adjust hyperparameters for optimal performance
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-roboto px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 tracking-wide"
          >
            Configure Model
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Model Settings"
          >
            <p className="font-openSans text-slate-700 mb-4 leading-relaxed">
              Set learning rate, batch size, and other training parameters.
            </p>
            <input 
              type="text" 
              placeholder="Enter learning rate..." 
              className="font-inter border-2 border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200" 
            />
          </Modal>
        </section>

        {/* Tabs Section */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-colors duration-300">
          <h2 className="font-inter text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
            Development Workflow
          </h2>
          <p className="font-openSans text-slate-400 text-sm mb-6 leading-relaxed">
            Explore different stages of AI model development and deployment
          </p>
          <Tabs tabs={tabsData} />
        </section>

        {/* Disclosure Section */}
        <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-colors duration-300">
          <h2 className="font-inter text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
            AI Fundamentals
          </h2>
          <p className="font-openSans text-slate-400 text-sm mb-6 leading-relaxed">
            Key concepts and techniques in modern AI development
          </p>
          <div className="space-y-4">
            <Disclosure title="Neural Networks Basics">
              <p className="font-roboto text-slate-700 leading-relaxed">
                Deep neural networks learn hierarchical representations of data through multiple layers of neurons. Training involves backpropagation to minimize loss and optimize weights efficiently.
              </p>
            </Disclosure>
            <Disclosure title="Transformer Architecture">
              <p className="font-openSans text-slate-700 leading-relaxed">
                Transformers use attention mechanisms to process sequential data in parallel. They power modern large language models and have revolutionized NLP applications globally.
              </p>
            </Disclosure>
            <Disclosure title="Model Optimization">
              <p className="font-inter text-slate-700 leading-relaxed">
                Quantization, pruning, and knowledge distillation reduce model size for faster inference. Optimization techniques enable deployment on edge devices and reduce computational costs.
              </p>
            </Disclosure>
          </div>
        </section>

      </div>
    </div>
  );
}