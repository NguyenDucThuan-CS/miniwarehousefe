"use client"
import { useRef, useEffect } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { ArrowDownUp } from 'lucide-react';


const DragCustomRenderer = (props: CustomCellRendererProps) => {
    const myRef = useRef(null);

    useEffect(() => {
        props.registerRowDragger(myRef.current!, 0);
    });

    return (
        <div className="flex items-center justify-center cursor-pointer">
            <ArrowDownUp size={14} ref={myRef} />
        </div>
    );
};
export default DragCustomRenderer;