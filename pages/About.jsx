import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const team = [
    { name: 'Shafrin',  image: '/images/Member1.jpeg' },
    { name: 'Shavindi',  image: '/images/Member2.png' },
    { name: 'Thushalini',  image: '/images/Member3.jpeg' },
    { name: 'Heli',  image: '/images/Member4 (1).jpg' },
    { name: 'Vithush',  image: '/images/Member5.jpeg' },
    { name: 'Sara', image: '/images/Member6.jpeg' },
    { name: 'Piyula', image: '/images/member6.png' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Our Story */}
      <section className="py-24 px-8 border-b border-gray-800">
        <div className="max-w-6xl mx-auto text-center mb-16 px-8">
          <h3 className="text-2xl font-bold text-center mb-4">
            Our Story
          </h3>
          <p className="text-gray-300 max-w-4xl mx-auto text-lg text-center leading-relaxed">
            At Hexa, we believe style is personal. We design premium-quality, minimalist t-shirts that blend comfort, durability, and intelligent minimalism.
          </p>
        </div>

        {/* Story Cards Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 px-8">
          {/* Left: Story Illustration */}
          <div className="bg-gray-300 rounded-3xl p-8 flex items-center justify-center min-h-80 overflow-hidden">
            <img src="/images/vision.png" alt="Vision" className="w-full h-full object-cover" />
          </div>

          {/* Middle: Mission */}
          <div className="bg-gray-300 text-black rounded-3xl p-8 min-h-80 flex flex-col justify-center">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-center mb-4">Our Mission</h3>
            <p className="text-gray-900 text-center text-sm leading-relaxed">
              To empower self-expression through premium, minimalist essentials crafted for comfort, built for longevity, and designed to make a subtle statement.
            </p>
          </div>

          {/* Right: Vision */}
          <div className="bg-gray-300 text-black rounded-3xl p-8 min-h-80 flex flex-col justify-center">
            <div className="text-4xl mb-4 text-center">👁️</div>
            <h3 className="text-2xl font-bold text-center mb-4">Our Vision</h3>
            <p className="text-gray-900 text-center text-sm leading-relaxed">
              To be the go-to brand for those who value simplicity, comfort, and enduring style in their everyday wardrobe.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 px-8 border-b border-gray-800">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 px-8">
          {/* Left: Team Members */}
          <div>
            <h2 className="text-4xl font-bold text-left mb-6">
  Meet the Team
</h2>
<br></br>
            <p className="text-gray-400 mb-12 text-left max-w-lg">
              Hexa is powered by a small, passionate team of designers, makers, and creatives who share a love for premium fashion and functional design. Together, we're building a brand that values authenticity, quality, and the people who wear our essentials.
            </p>
<br></br>
            {/* Team Member Circles */}
            <div className="flex gap-8 flex-wrap">
              {team.map((member, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500 mb-3">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-semibold text-center">{member.name}</p>
                  <p className="text-xs text-gray-400 text-center">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Workspace Image */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 h-64">
            <img src="/images/workplace.jpeg" alt="Workspace" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}