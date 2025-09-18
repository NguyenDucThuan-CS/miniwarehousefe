"use client";

import * as React from "react";

export function TableSkeleton({ columns = 20, rows = 50 }: { columns: number, rows: number }) {
  return (
    <div className="overflow-x-auto rounded border h-full flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="h-10 flex items-center px-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1 px-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Body */}
      <div className="flex-1">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b last:border-b-0">
            <div className="h-12 flex items-center px-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1 px-2">
                  <div 
                    className="h-4 bg-muted/50 rounded animate-pulse"
                    style={{
                      animationDelay: `${(rowIndex * 10 + colIndex) * 50}ms`,
                      animationDuration: '1.5s'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
