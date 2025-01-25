import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';

const Canvas = forwardRef(({ fillColor, size, onSquareFill }, ref) => {
    const canvasRef = useRef(null);
    const [gridSize] = useState(60); // Размер квадрата сетки
    const [canvasSize] = useState(3000); // Размер канваса
    const contextRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clearCanvas() {
            const context = contextRef.current;
            context.clearRect(0, 0, canvasSize, canvasSize); // Очищаем весь канвас
            drawGrid(); // Перерисовываем сетку после очистки
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        contextRef.current = canvas.getContext('2d');
        drawGrid();
    }, [canvasSize]);

    const drawGrid = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, canvasSize, canvasSize); // Очистка канваса
        context.strokeStyle = 'lightgray'; // Цвет линий сетки
        context.lineWidth = 1;

        for (let x = 0; x <= canvasSize; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasSize);
        }

        for (let y = 0; y <= canvasSize; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasSize, y);
        }

        context.stroke();
    };

    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
        const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

        fillSquare(x, y);

        // Передаем координаты и размер закрашенного квадрата
        onSquareFill(fillColor, x / gridSize, y / gridSize, size);
    };

    const fillSquare = (x, y) => {
        const context = contextRef.current;

        // Закрашиваем квадрат в зависимости от выбранного размера
        context.fillStyle = fillColor; // Цвет заливки квадрата
        context.fillRect(x, y, gridSize * size, gridSize * size); // Изменяем размер закрашиваемого квадрата
    };

    return (
        <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ border: '1px solid black' }}
        />
    );
});

export default Canvas;
