import React from 'react';
import { motion } from 'framer-motion';

function FeatureCards() {
  const features = [
    {
      icon: '🪖',
      title: 'No Helmet Detection',
      description: '💡 Smart rides begin with smart detection — helmet on, life on.',
    },
    {
      icon: '📵',
      title: 'Phone Usage Detection',
      description: '📱 Gear up before you go up — safety first.',
    },
    {
      icon: '🛵',
      title: 'Triple Riding Detection',
      description: '🧍‍♂️🧍‍♂️🧍‍♂️ Safety first: automated detection of triple riding saves lives.',
    },
    {
      icon: '🚫',
      title: 'Wrong Way Detection',
      description: '📍 Every road sign is a guide to safety. Don’t ignore the directions.',
    },
    {
      icon: '➕',
      title: 'Additional',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* First row with extra gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-24">
        {features.slice(0, 3).map((feature, index) => (
          <motion.div
            key={index}
            className="w-72 h-72 bg-gray-100 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
            {feature.description && (
              <p className="text-sm text-gray-700">{feature.description}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Second row, centered with even more vertical gap */}
      <div className="mt-24 flex flex-col lg:flex-row items-center justify-center gap-x-24 gap-y-16">
        {features.slice(3).map((feature, index) => (
          <motion.div
            key={index + 3}
            className="w-72 h-72 bg-gray-100 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: (index + 3) * 0.1,
              ease: 'easeOut',
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
            {feature.description && (
              <p className="text-sm text-gray-700">{feature.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeatureCards;
