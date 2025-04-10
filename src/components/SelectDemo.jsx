import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export function SelectDemo({ onValueChange }) {
    
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="bg-gray-50 border border-blue-900 text-gray-900 text-sm rounded-xl w-full py-5 flex justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 7V13M13 10H7M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="#0D394F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <SelectValue placeholder="ជ្រើសរើសបញ្ហា" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Issue Type</SelectLabel>
          <SelectItem value="quality">Quality</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="merchandising">Merchandising</SelectItem>
          <SelectItem value="payment settlement">Payment Settlement</SelectItem>
          <SelectItem value="resources trade tools"> Resource/Trade tools </SelectItem>
          <SelectItem value="competitors">Competitors</SelectItem>
          <SelectItem value="salesman">Salesman</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
