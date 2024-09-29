import React, { useState, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import EXIF from "exif-js";
import Overlay from "./Overlay";
import { Typography } from "@material-tailwind/react";
import logo from "../assets/logo.png"


 
export function Footer() {
  return (
    <footer className="w-full bg-white p-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
      <img
              className="h-12 w-auto"
              src={logo}
              alt=""
            />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="sky-gray"
              className="text-xs transition-colors hover:text-sky-500 focus:text-sky-500"
            >
              Devpost
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="text-xs transition-colors hover:text-sky-500 focus:text-sky-500"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="sky-gray"
              className="text-xs transition-colors hover:text-sky-500 focus:text-sky-500"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-sky-gray-50 my-0.5" />
      <Typography color="sky-gray" className="text-center text-xs">
        &copy; 2024 Ctrl-Alt-Defeat - Shellhacks
      </Typography>
    </footer>
  );
}

export default Footer;