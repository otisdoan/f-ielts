
"use client";

import Link from 'next/link';
import { useTheme } from "@/components/ThemeProvider";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-[#e6dbdb] dark:border-[#3d2a2a] pt-20 pb-10 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="text-primary size-8">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"></path>
                </svg>
              </div>
              <h2 className="text-[#181111] dark:text-white text-xl font-black">
                F-IELTS
              </h2>
            </div>
            <p className="text-[#181111]/60 dark:text-gray-400 text-sm leading-relaxed">
              Empowering students globally to achieve their dream IELTS scores
              through cutting-edge AI technology and expert pedagogy.
            </p>
            <div className="flex items-center gap-4">
              <Link
                className="size-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </Link>
              <Link
                className="size-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </Link>
              <Link
                className="size-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-[#181111] dark:text-white font-bold mb-6">
              Product
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  AI Writing Grading
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Speaking Simulator
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Video Courses
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#181111] dark:text-white font-bold mb-6">
              Resources
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  IELTS Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Study Guides
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Grammar Bank
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#181111] dark:text-white font-bold mb-6">
              Company
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#e6dbdb] dark:border-[#3d2a2a] pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2024 F-IELTS Education. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-sm">
                language
              </span>
              <span>English (US)</span>
            </div>
            <button
               onClick={toggleTheme}
              className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
