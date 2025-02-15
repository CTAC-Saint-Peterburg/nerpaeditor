import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ fillColor, size, onSquareFill, filledSquares }, ref) => {
    const canvasRef = useRef(null);
    const gridSize = 60;
    const canvasSize = 3000;
    const rulerSize = 40; // Размер линейки (высота для X, ширина для Y)
    const contextRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clearCanvas() {
            const context = contextRef.current;
            context.clearRect(0, 0, canvasSize + rulerSize, canvasSize + rulerSize);
            drawFilledSquares();
            drawGrid();
            drawRulers();
        },
        drawFilledSquares() {
            drawFilledSquares();
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize + rulerSize; // Увеличиваем ширину для линейки Y
        canvas.height = canvasSize + rulerSize; // Увеличиваем высоту для линейки X
        contextRef.current = canvas.getContext('2d');
        drawFilledSquares();
        drawGrid();
        drawRulers(); // Отрисовываем линейки
    }, [canvasSize]);

    useEffect(() => {
        drawFilledSquares();
        drawGrid();
        drawRulers(); // Отрисовываем линейки при изменении filledSquares
    }, [filledSquares]);

    // Отрисовка сетки
    const drawGrid = () => {
        const context = contextRef.current;
        context.strokeStyle = 'lightgray';
        context.lineWidth = 1;

        // Отрисовка вертикальных линий
        for (let x = rulerSize; x <= canvasSize + rulerSize; x += gridSize) {
            context.moveTo(x, rulerSize);
            context.lineTo(x, canvasSize + rulerSize);
        }

        // Отрисовка горизонтальных линий
        for (let y = rulerSize; y <= canvasSize + rulerSize; y += gridSize) {
            context.moveTo(rulerSize, y);
            context.lineTo(canvasSize + rulerSize, y);
        }

        context.stroke();
    };

    // Отрисовка линеек
    const drawRulers = () => {
        const context = contextRef.current;
        context.fillStyle = 'black';
        context.font = '14px Arial';
        context.textAlign = 'center';

        // Линейка по оси X (верхняя)
        for (let x = rulerSize; x <= canvasSize + rulerSize; x += gridSize) {
            const cellNumber = (x - rulerSize) / gridSize;
            context.fillText(cellNumber.toString(), x + gridSize / 2, rulerSize / 2 + 5);
        }

        // Линейка по оси Y (левая)
        context.save();
        context.translate(0, rulerSize);
        context.rotate(-Math.PI / 2); // Поворачиваем текст на 90 градусов
        for (let y = rulerSize; y <= canvasSize + rulerSize; y += gridSize) {
            const cellNumber = (y - rulerSize) / gridSize;
            context.fillText(cellNumber.toString(), -y + gridSize / 2, rulerSize / 2 + 5);
        }
        context.restore();
    };

    // Обработчик клика по холсту
    const handleClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left - rulerSize) / gridSize) * gridSize + rulerSize;
        const y = Math.floor((event.clientY - rect.top - rulerSize) / gridSize) * gridSize + rulerSize;

        if (x >= rulerSize && y >= rulerSize) { // Игнорируем клики по линейкам
            fillSquare(x, y);
            onSquareFill(fillColor, (x - rulerSize) / gridSize, (y - rulerSize) / gridSize, size);
        }
    };

    // Закрашивание квадрата
    const fillSquare = (x, y) => {
        const context = contextRef.current;
        context.fillStyle = fillColor;
        context.fillRect(
            x,
            y,
            gridSize * (size.width || size),
            gridSize * (size.height || size)
        );
    };

    // Отрисовка всех закрашенных квадратов
    const drawFilledSquares = () => {
        const context = contextRef.current;
        context.clearRect(0, 0, canvasSize + rulerSize, canvasSize + rulerSize);

        // Отрисовка квадратов
        filledSquares.forEach(({ color, x, y, size, number }) => {
            context.fillStyle = color;
            context.fillRect(
                x * gridSize + rulerSize,
                y * gridSize + rulerSize,
                gridSize * (size.width || size),
                gridSize * (size.height || size)
            );

            // Отрисовка номера квадрата
            context.fillStyle = 'white';
            context.font = '20px Arial';
            context.fillText(
                number.toString(),
                x * gridSize + rulerSize + 5,
                y * gridSize + rulerSize + 25
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