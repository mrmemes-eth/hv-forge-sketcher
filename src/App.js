import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const initialGrid = () => Array(13).fill(Array(21).fill("blank"));
  const [grid, setGrid] = useState(() => {
    const storedGrid = localStorage.getItem("grid");
    return storedGrid ? JSON.parse(storedGrid) : initialGrid();
  });
  const tiles = [
    "bark",
    "black-rock",
    "clay",
    "concrete",
    "grassland",
    "heavy-metal",
    "lawn",
    "light-concrete",
    "metal",
    "nailed-metal",
    "sand",
    "warehouse",
    "watermelon",
    "wooden-floor",
    "blank",
  ];
  const backgroundStyles = ["glitch", "bio", "knight"];

  const [selectedTile, setSelectedTile] = useState("blank");
  const [backgroundStyle, setBackgroundStyle] = useState("blank");

  const reservedCells = useMemo(() => new Set(), []);

  const setCellTile = (rowIndex, colIndex, tile) => {
    setGrid((prevGrid) => {
      const updatedGrid = JSON.parse(JSON.stringify(prevGrid));
      updatedGrid[rowIndex][colIndex] = tile;
      return updatedGrid;
    });
  };

  const setupReservedCells = () => {
    const reservedCellEntries = [
      [[4, 0], "restricted base"],
      [[4, 1], "restricted base"],
      [[4, 2], "restricted base"],
      [[5, 0], "restricted base"],
      [[5, 1], "restricted base"],
      [[5, 2], "restricted base"],
      [[6, 0], "restricted base"],
      [[6, 1], "restricted base"],
      [[6, 2], "restricted base"],
      [[7, 0], "restricted base"],
      [[7, 1], "restricted base"],
      [[7, 2], "restricted base"],
      [[0, 4], "restricted portal"],
      [[1, 4], "restricted portal"],
      [[0, 5], "restricted portal"],
      [[1, 5], "restricted portal"],
      [[0, 11], "restricted portal"],
      [[1, 11], "restricted portal"],
      [[0, 12], "restricted portal"],
      [[1, 12], "restricted portal"],
      [[3, 17], "restricted portal"],
      [[4, 17], "restricted portal"],
      [[3, 18], "restricted portal"],
      [[4, 18], "restricted portal"],
      [[5, 18], "restricted big-portal"],
      [[6, 18], "restricted big-portal"],
      [[7, 18], "restricted big-portal"],
      [[5, 19], "restricted big-portal"],
      [[6, 19], "restricted big-portal"],
      [[7, 19], "restricted big-portal"],
      [[5, 20], "restricted big-portal"],
      [[6, 20], "restricted big-portal"],
      [[7, 20], "restricted big-portal"],
      [[11, 13], "restricted portal"],
      [[11, 14], "restricted portal"],
      [[12, 13], "restricted portal"],
      [[12, 14], "restricted portal"],
    ];
    reservedCellEntries.forEach(([pos, tile]) => {
      reservedCells.add(pos.toString());
      const [rowIndex, colIndex] = pos;
      setCellTile(rowIndex, colIndex, tile);
    });
  };

  useEffect(setupReservedCells, []);

  useEffect(() => {
    localStorage.setItem("grid", JSON.stringify(grid));
  }, [grid]);

  const handleCellClick = (rowIndex, colIndex, tile) => {
    if (reservedCells.has([rowIndex, colIndex].toString())) {
      return;
    } else {
      setCellTile(rowIndex, colIndex, tile);
    }
  };

  const handleResetGrid = () => {
    localStorage.removeItem("grid");
    setGrid(initialGrid());
    setupReservedCells();
  };

  return (
    <div className="app-wrap">
      <header className="app">
        <div>
          <h3>Background Color</h3>
          <div className="color-palette">
            {backgroundStyles.map((styleName) => (
              <div
                key={styleName}
                className={`bg-style${
                  styleName === backgroundStyle ? " selected" : ""
                } ${styleName}`}
                onClick={() => setBackgroundStyle(styleName)}
              ></div>
            ))}
          </div>
        </div>
        <div>
          <h3>Cell Color</h3>
          <div className="color-palette">
            {tiles.map((tile) => (
              <div
                key={tile}
                className={`tile${
                  tile === selectedTile ? " selected" : ""
                } ${tile}`}
                onClick={() => setSelectedTile(tile)}
              ></div>
            ))}
          </div>
        </div>
        <div className="controls">
          <button onClick={handleResetGrid}>Reset Grid</button>
        </div>
      </header>
      <main className="app">
        <div className={`grid ${backgroundStyle}`}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${tile}`}
                  onClick={() =>
                    handleCellClick(rowIndex, colIndex, selectedTile)
                  }
                ></div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
