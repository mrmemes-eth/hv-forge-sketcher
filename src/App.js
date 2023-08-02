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
    "water",
    "watermelon",
    "wooden-floor",
    "blank",
  ];
  const backgroundStyles = [
    "glitch",
    "dynamic",
    "bio",
    "knight",
    "celestial",
    "reaver",
    "holo",
    "legendary",
  ];
  const [selectedTile, setSelectedTile] = useState("blank");
  const [backgroundStyle, setBackgroundStyle] = useState(backgroundStyles[0]);
  const [previewBgStyle, setPreviewBgStyle] = useState(backgroundStyle);
  const [previewTile, setPreviewTile] = useState(selectedTile);

  const initTile = (name = "blank") => {
    return {
      title: name,
      rotation: 0,
      version: "0.0.1"
    };
  };

  const initHVGrid = () => {
    return {
      grid: Array(13).fill(Array.from({ length: 21 }, initTile)),
      restorePoint: null,
    };
  };

  const initializeSaveData = () => {
    const saveData = {};
    backgroundStyles.forEach((style) => {
      saveData[style] = initHVGrid();
    });
    return saveData;
  };

  const [saveData, setSaveData] = useState(() => {
    const storedSaveData = localStorage.getItem("grid-data");
    return storedSaveData ? JSON.parse(storedSaveData) : initializeSaveData();
  });

  const reservedCells = useMemo(() => new Set(), []);

  const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

  const setCellTile = (bg, rowIndex, colIndex, tileName) => {
    setSaveData((prevSaveData) => {
      const updatedSaveData = cloneObject(prevSaveData);
      if (!updatedSaveData[bg]) {
        updatedSaveData[bg] = initHVGrid();
      }
      // object version upgrade, this should also handle upgrades from the tile being a string
      if (updatedSaveData[bg]["grid"][rowIndex][colIndex].version !== "0.0.1") {
        updatedSaveData[bg]["grid"][rowIndex][colIndex] = initTile(tileName);
        return updatedSaveData;
      }
      const currentTile = updatedSaveData[bg]["grid"][rowIndex][colIndex];
      const isRestricted = currentTile.title.substring(0, 10) === "restricted";
      if (isRestricted) {
        return updatedSaveData;
      } else {
        updatedSaveData[bg]["grid"][rowIndex][colIndex] = initTile(tileName);
      }
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
      [[0, 4], "restricted portal first"],
      [[1, 4], "restricted portal"],
      [[0, 5], "restricted portal"],
      [[1, 5], "restricted portal"],
      [[0, 11], "restricted portal first"],
      [[1, 11], "restricted portal"],
      [[0, 12], "restricted portal"],
      [[1, 12], "restricted portal"],
      [[3, 17], "restricted portal first"],
      [[4, 17], "restricted portal"],
      [[3, 18], "restricted portal"],
      [[4, 18], "restricted portal"],
      [[5, 18], "restricted big-portal first"],
      [[6, 18], "restricted big-portal"],
      [[7, 18], "restricted big-portal"],
      [[5, 19], "restricted big-portal"],
      [[6, 19], "restricted big-portal"],
      [[7, 19], "restricted big-portal"],
      [[5, 20], "restricted big-portal"],
      [[6, 20], "restricted big-portal"],
      [[7, 20], "restricted big-portal"],
      [[11, 13], "restricted portal first"],
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setupReservedCells, []);

  useEffect(() => {
    localStorage.setItem("grid-data", JSON.stringify(saveData));
  }, [saveData]);

  const handleTileRotation = (rowIndex, colIndex, angle) => {
    setSaveData((prevSaveData) => {
      const updatedSaveData = cloneObject(prevSaveData);
      const { grid } = updatedSaveData[backgroundStyle];
      const currentTile = grid[rowIndex][colIndex];
      const isRestricted = currentTile.title.substring(0, 10) === "restricted";
      if (isRestricted) {
        return updatedSaveData;
      }
      currentTile.rotation += angle;
      if (currentTile.rotation >= 360) {
        currentTile.rotation -= 360;
      }
      return updatedSaveData;
    });
  };

  const handleCellPaint = (event, rowIndex, colIndex, tile) => {
    if (reservedCells.has([rowIndex, colIndex].toString())) {
      return;
    } else {
      if (event.shiftKey) {
        setCellTile(backgroundStyle, rowIndex, colIndex, "blank");
      } else {
        setCellTile(backgroundStyle, rowIndex, colIndex, tile);
      }
    }
  };

  const handleResetGrid = () => {
    setSaveData((prevSaveData) => {
      const updatedSaveData = cloneObject(prevSaveData);
      updatedSaveData[backgroundStyle] = initHVGrid();
      return updatedSaveData;
    });
    setupReservedCells();
  };

  const handleSaveRestorePoint = () => {
    // update restorepoint attribute in saveData
    setSaveData((prevSaveData) => {
      const updatedSaveData = cloneObject(prevSaveData);
      updatedSaveData[backgroundStyle]["restorePoint"] = JSON.parse(
        JSON.stringify(updatedSaveData[backgroundStyle]["grid"])
      );
      return updatedSaveData;
    });
  };

  const handleRestore = () => {
    if (saveData[backgroundStyle]["restorePoint"]) {
      setSaveData((prevSaveData) => {
        const updatedSaveData = cloneObject(prevSaveData);
        updatedSaveData[backgroundStyle]["grid"] =
          saveData[backgroundStyle]["restorePoint"];
        return updatedSaveData;
      });
    }
  };

  const [isPainting, setIsPainting] = useState(false);

  const handleMouseDown = (event, rowIndex, colIndex) => {
    setIsPainting(true);
    if (event.button === 2) {
      handleTileRotation(rowIndex, colIndex, 90);
    } else {
      handleCellPaint(event, rowIndex, colIndex, selectedTile);
    }
  };

  const handleMouseEnter = (event, rowIndex, colIndex) => {
    if (isPainting) {
      handleCellPaint(event, rowIndex, colIndex, selectedTile);
    }
  };
  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const kebabToTitleCase = (kebab) => {
    const words = kebab.split("-");
    return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  };

  const countTiles = () => {
    if (!saveData[backgroundStyle]) return 0;
    const count = saveData[backgroundStyle]["grid"].flatMap((row) =>
      row.filter((tile) => tile.title !== "blank")
    ).length;
    return count - reservedCells.size;
  };

  const handlePreviewMouseEnter = (tile) => {
    setPreviewTile(tile);
  };

  const handlePreviewMouseLeave = () => {
    setPreviewTile(selectedTile);
  };

  const handleBgStyleMouseEnter = (style) => {
    setPreviewBgStyle(style);
  };

  const handleBgStyleMouseLeave = () => {
    setPreviewBgStyle(backgroundStyle);
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
                onMouseEnter={() => handleBgStyleMouseEnter(styleName)}
                onMouseLeave={handleBgStyleMouseLeave}
              ></div>
            ))}
          </div>
          <p className="selected-swatch">{kebabToTitleCase(previewBgStyle)}</p>
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
                onMouseEnter={() => handlePreviewMouseEnter(tile)}
                onMouseLeave={handlePreviewMouseLeave}
              ></div>
            ))}
          </div>
          <p className="selected-swatch">{kebabToTitleCase(previewTile)}</p>
        </div>
        <div className={`preview tile ${previewTile}`}></div>
        <div className="controls">
          <p>Tile Count: {countTiles()}</p>
          <button onClick={handleResetGrid}>Reset Grid</button>
          <button onClick={handleSaveRestorePoint}>Save Restore Point</button>
          <button onClick={handleRestore}>Restore</button>
        </div>
      </header>
      <main className="app">
        <div className={`grid ${backgroundStyle}`}>
          {saveData[backgroundStyle]["grid"].map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  data-rotation={tile.rotation}
                  className={`cell ${tile.title}`}
                  onMouseDown={(event) =>
                    handleMouseDown(event, rowIndex, colIndex)
                  }
                  onMouseEnter={(event) =>
                    handleMouseEnter(event, rowIndex, colIndex)
                  }
                  onContextMenu={(event) => event.preventDefault()}
                  onMouseUp={handleMouseUp}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <footer className="app">
        <p>
          <a href="https://github.com/mrmemes-eth/hv-forge-sketcher">
            Fork me on github
          </a>
        </p>
        <p>
          Tip me on ETH: <code>mrmemes.eth</code> or on twitter:{" "}
          <a href="https://twitter.com/mrmemes_eth">
            <code>@mrmemes_eth</code>
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
