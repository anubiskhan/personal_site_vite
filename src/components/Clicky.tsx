import { useState, useEffect } from 'react';
import '../styles/Clicky.css';
import { MyColors } from '../myColors';

interface ColorCounter {
    [key: string]: number;
}

const Clicky = () => {
    const colorArray = Object.values(MyColors);
    const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);
    const [nextId, setNextId] = useState(1);
    const [colorCounts, setColorCounts] = useState<ColorCounter>({
        [MyColors.BLACK]: 0,
        [MyColors.BLUE]: 0,
        [MyColors.BROWN]: 0,
        [MyColors.GRAY]: 0,
        [MyColors.GREEN]: 0,
        [MyColors.ORANGE]: 0,
        [MyColors.WHITE]: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // Filter available colors (those with count < 10)
            const availableColors = colorArray.filter(color => colorCounts[color] < 10);
            
            if (availableColors.length > 0) {
                const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
                setBubbles(prevBubbles => [
                    ...prevBubbles,
                    { id: nextId, x: Math.random() * 90, y: Math.random() * 90, color: randomColor as string }
                ]);
                setNextId(prevId => prevId + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextId, colorCounts]);

    const handleMouseMove = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((event.clientY - rect.top) / rect.height) * 100;
        
        setBubbles(prevBubbles => {
            const poppedBubbles = prevBubbles.filter(bubble => {
                const dx = mouseX - bubble.x;
                const dy = mouseY - bubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance <= 6;
            });

            // Increment counters for popped bubbles, but don't exceed 10
            if (poppedBubbles.length > 0) {
                setColorCounts(prevCounts => {
                    const newCounts = { ...prevCounts };
                    poppedBubbles.forEach(bubble => {
                        // Only increment if current count is less than 10
                        if (newCounts[bubble.color] < 10) {
                            newCounts[bubble.color] = Math.min(10, (newCounts[bubble.color] || 0) + 1);
                        }
                    });
                    return newCounts;
                });
            }

            // Return remaining bubbles
            return prevBubbles.filter(bubble => {
                const dx = mouseX - bubble.x;
                const dy = mouseY - bubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance > 6;
            });
        });
    };

    // Display counters
    const renderCounters = () => (
        <div className="counters">
            {Object.entries(colorCounts).map(([color, count]) => (
                <div 
                    key={color} 
                    className="counter"
                    style={{ 
                        backgroundColor: color,
                        color: ['#eff1f3ff', '#5dfdcbff'].includes(color) ? '#000' : '#fff'
                    }}
                >
                    {count}/10
                </div>
            ))}
        </div>
    );

    return (
        <div className='main'>
            {renderCounters()}
            <div
                className='frame'
                onMouseMove={handleMouseMove}
            >
                {bubbles.map(bubble => (
                    <div
                        key={bubble.id}
                        className='bubble'
                        style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, backgroundColor: bubble.color }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Clicky;
