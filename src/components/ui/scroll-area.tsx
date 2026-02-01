import React from 'react';
import { ScrollArea, Viewport, Thumb, Scrollbar, Corner } from '@radix-ui/react-scroll-area';

const ScrollAreaComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ScrollArea className="ScrollArea" style={{ width: '100%', height: '300px' }}>
            <Viewport className="ScrollAreaViewport">
                {children}
            </Viewport>
            <Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <Thumb className="ScrollAreaThumb" />
            </Scrollbar>
            <Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                <Thumb className="ScrollAreaThumb" />
            </Scrollbar>
            <Corner className="ScrollAreaCorner" />
        </ScrollArea>
    );
};

export default ScrollAreaComponent;