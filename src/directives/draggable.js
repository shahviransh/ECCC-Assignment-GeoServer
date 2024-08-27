// src/directives/draggable.js
export default {
  mounted(el) {
    el.style.position = "absolute";
    el.style.cursor = "move";

    el.onmousedown = function (e) {
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = el.getBoundingClientRect();

      const offsetX = startX - rect.left;
      const offsetY = startY - rect.top;

      function onMouseMove(e) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
  },
};
