export function getButtonContainerCSS(position) {
    return `
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
    `;
}

export function getDragBoxCSS({ x, y, width, height }) {
    return `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${width}px;
    height: ${height}px;
  `;
}
