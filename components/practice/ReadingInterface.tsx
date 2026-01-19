
"use client";
import React, { useState } from "react";

export default function ReadingInterface() {
  const [activeQuestion, setActiveQuestion] = useState(1);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#181111] dark:text-gray-100 overflow-hidden font-display flex flex-col h-screen">
      {/* Header Section */}
      <header className="flex-none flex items-center justify-between border-b border-solid border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-zinc-900 px-6 py-3 z-50">
        <div className="flex items-center gap-4 text-[#181111] dark:text-white">
          <div className="size-6 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            F-IELTS
          </h2>
        </div>
        {/* Timer Integration */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="flex flex-col items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded">
              <p className="text-sm font-bold leading-none">00</p>
              <p className="text-[10px] uppercase opacity-60">Hr</p>
            </div>
            <div className="flex flex-col items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded border-b-2 border-primary">
              <p className="text-sm font-bold leading-none text-primary">54</p>
              <p className="text-[10px] uppercase opacity-60 text-primary">
                Min
              </p>
            </div>
            <div className="flex flex-col items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded">
              <p className="text-sm font-bold leading-none">12</p>
              <p className="text-[10px] uppercase opacity-60">Sec</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold">
            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
            24 / 40 Answered
          </div>
          <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer">
            Submit
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-primary/20"
            data-alt="Student profile avatar"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGuyk8VanWgXXRGNSuSA1bu7wcCkHhaUDzdX1McfQQdaQFUNWD3quIfPhuWELDAHwzDpnqit0FfkuzK3_b6-TmW7dlQE83JnckrSckz2mJwlXpZ6OwAMMu_8vDgF1fdyft0KdHf6UBnbzLPO6HUyng6o-pDvGF1dd90k1i3rbFLTZPteaMJWyJtKVFp_ycpZ75pkizUV6Ny7xPwwzl2Z_4Utm2xiDHyr_3zLnSapPPrt7n2L2bP6dcRsMyCy-odHGz-j_TZi__405o')",
            }}
          ></div>
        </div>
      </header>

      {/* Question Pagination Bar */}
      <div className="flex-none bg-white dark:bg-zinc-900 border-b border-[#e5e7eb] dark:border-gray-800 px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max mx-auto justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setActiveQuestion(num)}
              className={`flex size-8 items-center justify-center rounded text-xs cursor-pointer transition-colors ${
                activeQuestion === num
                  ? "bg-primary text-white font-bold"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"
              }`}
            >
              {num}
            </button>
          ))}
          <span className="text-zinc-400 px-1">...</span>
          <button className="flex size-8 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 text-xs hover:bg-zinc-200">
            40
          </button>
        </div>
      </div>

      {/* Main Content Split Screen */}
      <main className="flex-1 flex w-full overflow-hidden">
        {/* Left Side: Reading Passage */}
        <section className="w-1/2 flex flex-col border-r border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-zinc-900 relative">
          {/* Toolbar for Annotation */}
          <div className="flex-none flex justify-between items-center px-8 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Reading Passage 1
            </span>
            <div className="flex gap-1">
              <button
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                title="Highlight"
              >
                <span className="material-symbols-outlined text-[20px]">
                  highlighter_size_3
                </span>
              </button>
              <button
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                title="Text Size"
              >
                <span className="material-symbols-outlined text-[20px]">
                  text_fields
                </span>
              </button>
              <button
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                title="Clear All"
              >
                <span className="material-symbols-outlined text-[20px]">
                  ink_eraser
                </span>
              </button>
            </div>
          </div>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-8">
            <h1 className="text-3xl font-bold leading-tight mb-8 text-zinc-900 dark:text-white">
              The History of Sustainable Architecture
            </h1>
            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-zinc-800 dark:text-zinc-300">
              <p>
                The origins of sustainable architecture can be traced back to the
                ancient civilizations that built structures in harmony with their
                environment. The Anasazi in the American Southwest, for example,
                designed their dwellings to take advantage of solar orientation.
                During the winter, the low sun would reach deep into the
                rock-sheltered homes, providing warmth. In the summer, the
                overhangs provided shade, keeping the interiors cool.
              </p>
              <p>
                <mark className="bg-yellow-200 dark:bg-yellow-900/50 rounded-sm px-1">
                  Modern sustainable architecture emerged in the late 1960s
                </mark>{" "}
                as a response to the growing environmental movement. Architects
                began to experiment with energy-efficient designs and renewable
                energy sources. One of the pioneers in this field was
                Buckminster Fuller, who developed the geodesic dome, a structure
                that uses minimal materials to enclose a large volume of space.
              </p>
              <p>
                The 1970s energy crisis further accelerated the development of
                sustainable architecture. With oil prices skyrocketing, there was
                a surge in interest in solar power and energy conservation. This
                period saw the construction of many passive solar homes, which
                used the sun&apos;s energy for heating and cooling without the
                need for mechanical systems.
              </p>
              <p>
                By the 1990s, sustainable architecture had become more
                mainstream. The United States Green Building Council (USGBC) was
                founded in 1993, and its Leadership in Energy and Environmental
                Design (LEED) rating system became the standard for evaluating
                the sustainability of buildings.
              </p>
              <p>
                Today, sustainable architecture is more important than ever as
                the world faces the challenges of climate change and resource
                depletion. Architects are now using advanced technology and
                materials to create buildings that are not only energy-efficient
                but also produce their own energy and recycle their own waste.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Questions */}
        <section className="w-1/2 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-8">
            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Questions 1-4
              </h3>
              <p className="text-sm italic text-zinc-600 dark:text-zinc-400 mb-6 border-l-4 border-zinc-200 dark:border-zinc-700 pl-4">
                Do the following statements agree with the information given in
                the Reading Passage? Write TRUE, FALSE or NOT GIVEN.
              </p>
              <div className="space-y-8">
                {/* Question 1: Fill in the blank */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 size-7 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </span>
                    <div className="space-y-3 flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        The Anasazi people used solar energy primarily for
                        cooking food in the winter.
                      </p>
                      <div className="flex gap-3">
                        <input
                          className="w-full max-w-xs h-10 px-3 rounded-lg border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none"
                          placeholder="Your answer (e.g. FALSE)"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Question 2: Multiple Choice */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border-2 border-primary/20 ring-1 ring-primary/10">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 size-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </span>
                    <div className="space-y-4 flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                        Which architect is credited with developing the geodesic
                        dome structure?
                      </p>
                      <div className="grid gap-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors">
                          <input
                            className="text-primary focus:ring-primary h-4 w-4"
                            name="q2"
                            type="radio"
                          />
                          <span className="text-sm">Frank Lloyd Wright</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-primary/40 bg-primary/5 dark:bg-primary/10 cursor-pointer transition-colors">
                          <input
                            defaultChecked
                            className="text-primary focus:ring-primary h-4 w-4"
                            name="q2"
                            type="radio"
                          />
                          <span className="text-sm font-medium">
                            Buckminster Fuller
                          </span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors">
                          <input
                            className="text-primary focus:ring-primary h-4 w-4"
                            name="q2"
                            type="radio"
                          />
                          <span className="text-sm">Le Corbusier</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors">
                          <input
                            className="text-primary focus:ring-primary h-4 w-4"
                            name="q2"
                            type="radio"
                          />
                          <span className="text-sm">Zaha Hadid</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Question 3 */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 size-7 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </span>
                    <div className="space-y-3 flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                        The LEED rating system was established in 1993 to
                        encourage green building practices.
                      </p>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            className="text-primary focus:ring-primary"
                            name="q3"
                            type="radio"
                          />
                          <span className="text-sm">True</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            className="text-primary focus:ring-primary"
                            name="q3"
                            type="radio"
                          />
                          <span className="text-sm">False</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            className="text-primary focus:ring-primary"
                            name="q3"
                            type="radio"
                          />
                          <span className="text-sm">Not Given</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Question Panel Footer */}
          <div className="flex-none p-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center bg-white dark:bg-zinc-900">
            <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-semibold">Previous Passage</span>
            </button>
            <div className="flex gap-2">
              <button className="px-5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                Review Later
              </button>
              <button className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 cursor-pointer">
                Next Passage
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Navigation Overlay (Floating small mobile indicator) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <button className="bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold cursor-pointer">
          <span className="material-symbols-outlined">quiz</span>
          Show Questions
        </button>
      </div>
    </div>
  );
}
