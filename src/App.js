import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
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
  const [backgroundStyle, setBackgroundStyle] = useState(backgroundStyles[0]);

  const initializeGrid = () => Array(13).fill(Array(21).fill("blank"));

  const initializeSaveData = () => {
    const saveData = {};
    backgroundStyles.forEach((style) => {
      saveData[style] = initializeGrid();
    });
    return saveData;
  };

  const [saveData, setSaveData] = useState(() => {
    const storedSaveData = localStorage.getItem("grid-data");
    return storedSaveData ? JSON.parse(storedSaveData) : initializeSaveData();
  });

  const reservedCells = useMemo(() => new Set(), []);

  const setCellTile = (bg, rowIndex, colIndex, tile) => {
    setSaveData((prevSaveData) => {
      const updatedSaveData = JSON.parse(JSON.stringify(prevSaveData));
      updatedSaveData[bg][rowIndex][colIndex] = tile;
      return updatedSaveData;
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
    backgroundStyles.forEach((style) => {
      reservedCellEntries.forEach(([pos, tile]) => {
        reservedCells.add(pos.toString());
        const [rowIndex, colIndex] = pos;
        setCellTile(style, rowIndex, colIndex, tile);
      });
    });
  };

  useEffect(setupReservedCells, []);

  useEffect(() => {
    localStorage.setItem("grid-data", JSON.stringify(saveData));
  }, [saveData]);

  const handleCellPaint = (rowIndex, colIndex, tile) => {
    if (reservedCells.has([rowIndex, colIndex].toString())) {
      return;
    } else {
      setCellTile(backgroundStyle, rowIndex, colIndex, tile);
    }
  };

  const handleResetGrid = () => {
    localStorage.removeItem("grid");
    saveData[backgroundStyle] = initializeGrid();
    setupReservedCells();
  };

  const [isPainting, setIsPainting] = useState(false);
  const handleMouseDown = (rowIndex, colIndex) => {
    handleCellPaint(rowIndex, colIndex, selectedTile);
    setIsPainting(true);
  };
  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isPainting) {
      handleCellPaint(rowIndex, colIndex, selectedTile);
    }
  };
  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const kebabToTitleCase = (kebab) => {
    const words = kebab.split("-");
    return words
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="app-wrap">
      <header className="app">
        <div className="palette">
          <h3>HV Type</h3>
          <div className="swatches">
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
          <p className="selected-swatch">{kebabToTitleCase(backgroundStyle)}</p>
        </div>
        <div className="palette">
          <h3>Tile Pattern</h3>
          <div className="swatches">
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
          <p className="selected-swatch">{kebabToTitleCase(selectedTile)}</p>
        </div>
        <div className="controls">
          <button onClick={handleResetGrid}>Reset Grid</button>
        </div>
      </header>
      <main className="app">
        <div className={`grid ${backgroundStyle}`}>
          {saveData[backgroundStyle].map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${tile}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
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
