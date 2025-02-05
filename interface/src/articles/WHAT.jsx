import React from 'react'
import { Link } from 'react-router-dom';

const WHAT = () => {
    return (
        // <h2 className="text-2xl font-bold mb-6">What is 
        //     <a to"/">Wav Wheel</Link>
        //     ?</h2>

            <article className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">What is &nbsp;<Link to="/">Wav Wheel</Link>
            ?</h2>
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">1. EQ Visual — Bars in a Circle</h3>
            <div className="mb-4">
              <p className="mb-2">
                Purpose: This EQ (Equalizer) visualization arranges frequency bands in a circular (radial) 
                layout, offering an immediate overview of frequency distribution.
              </p>
              <p className="font-medium mb-2">Function:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Visual Frequency Bands:</strong> Each bar represents a specific frequency range 
                  (e.g., lows, mids, highs). When a particular frequency's amplitude is strong, its 
                  corresponding bar extends outward.
                </li>
                <li>
                  <strong>Real-Time Adjustments:</strong> By observing the changing heights of these bars, 
                  producers can instantly detect problematic frequencies—such as overpowering bass or 
                  sharp, piercing highs.
                </li>
                <li>
                  <strong>Benefits:</strong> Quickly spot imbalances and tweak EQ settings before issues 
                  become ingrained in your mix.
                </li>
              </ul>
            </div>
          </section>
  
          <section>
            <h3 className="text-xl font-semibold mb-4">2. Waveform Visual — Line Plot in a Spiral</h3>
            <div className="mb-4">
              <p className="mb-2">
                Purpose: This spiral waveform depicts the time-domain data of your audio signal, swirling 
                outward in a visually compelling spiral.
              </p>
              <p className="font-medium mb-2">Function:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Time vs. Amplitude:</strong> The height of the line indicates amplitude at any 
                  given moment, making it easy to see transients (sudden spikes) or sustained sections.
                </li>
                <li>
                  <strong>Spiral Layout:</strong> The continuous spiral design takes a linear waveform and 
                  wraps it around a circular path, creating a visually striking "Wav Wheel" effect.
                </li>
                <li>
                  <strong>Benefits:</strong> Enhances understanding of how your audio evolves over time, 
                  allowing you to identify peaks, fades, and transitions in a more holistic, visually 
                  engaging manner.
                </li>
              </ul>
            </div>
          </section>
  
          <section>
            <h3 className="text-xl font-semibold mb-4">3. Limiter Info Visual — A Sphere Signaling Clipping</h3>
            <div className="mb-4">
              <p className="mb-2">
                Purpose: This sphere acts as a dynamic indicator of when your audio is nearing or hitting 
                its maximum volume threshold (clipping).
              </p>
              <p className="font-medium mb-2">Function:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Clipping Indicator:</strong> The sphere changes color or brightness if your mix 
                  approaches 0 dB or surpasses safe headroom.
                </li>
                <li>
                  <strong>Real-Time Feedback:</strong> Allows you to notice instantly if you're pushing 
                  your limiter too hard, preventing unwanted distortion.
                </li>
                <li>
                  <strong>Benefits:</strong> Preserves audio fidelity by guiding you away from 
                  over-compressing or over-limiting your track, ensuring clarity and headroom remain intact.
                </li>
              </ul>
            </div>
          </section>
  
          <section>
            <h3 className="text-xl font-semibold mb-4">4. Dynamics Visual — Expanding/Contracting Ring</h3>
            <div className="mb-4">
              <p className="mb-2">
                Purpose: This ring expands and contracts based on the average amplitude (loudness) of your 
                track, offering an at-a-glance reading of overall dynamics.
              </p>
              <p className="font-medium mb-2">Function:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Amplitude Tracking:</strong> As the track gets louder, the ring diameter grows; 
                  when quieter, it recedes.
                </li>
                <li>
                  <strong>Dynamic Range Awareness:</strong> Helps you quickly assess whether your song is 
                  overly compressed or retains enough dynamic range to feel alive and expressive.
                </li>
                <li>
                  <strong>Benefits:</strong> Encourages balanced production, ensuring quieter passages 
                  maintain depth while louder moments stand out effectively.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </article >
    );
  };

export default WHAT
