import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ fillColor, size, onSquareFill, filledSquares }, ref) => {
    const canvasRef = useRef(null);
    const gridSize = 60; // Размер одной клетки
    const canvasSize = 3000; // Размер холста
    const contextRef = useRef(null);

    // Методы, доступные родительскому компоненту
    useImperativeHandle(ref, () => ({
        clearCanvas() {
            const context = contextRef.current;
            context.clearRect(0, 0, canvasSize, canvasSize); // Очищаем холст
            drawGrid(); // Перерисовываем сетку
            drawFilledSquares(); // Перерисовываем квадраты
        },
        drawFilledSquares() {
            drawFilledSquares(); // Перерисовываем квадраты
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        contextRef.current = canvas.getContext('2d');
        drawGrid(); // Рисуем сетку при инициализации
        drawFilledSquares(); // Рисуем квадраты при инициализации
    }, [canvasSize]);

    useEffect(() => {
        drawFilledSquares(); // Перерисовываем квадраты при изменении filledSquares
    }, [filledSquares]);

    // Рисуем сетку
    const drawGrid = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, canvasSize, canvasSize); // Очищаем холст
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

    // Обработчик клика по холсту
    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
        const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

        fillSquare(x, y);

        // Передаем информацию о квадрате в родительский компонент
        onSquareFill(fillColor, x / gridSize, y / gridSize, size);
    };

    // Закрашиваем квадрат
    const fillSquare = (x, y) => {
        const context = contextRef.current;
        context.fillStyle = fillColor; // Цвет заливки
        context.fillRect(
            x,
            y,
            gridSize * (size.width || size), // Ширина
            gridSize * (size.height || size) // Высота
        );
    };

    // Рисуем все закрашенные квадраты
    const drawFilledSquares = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, canvasSize, canvasSize); // Очищаем холст
        drawGrid(); // Рисуем сетку

        // Рисуем квадраты, которые относятся к текущему слою
        filledSquares.forEach(({ color, x, y, size }) => {
            context.fillStyle = color; // Цвет заливки
            context.fillRect(
                x * gridSize,
                y * gridSize,
                gridSize * (size.width || size), // Ширина
                gridSize * (size.height || size) // Высота
            );
        });
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