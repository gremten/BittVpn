export default function AppShell({ children, figmaNode }) {
  return (
    <main className="preview-stage">
      <div
        className="app-shell"
        data-figma-page="🛠️ Userflow и прототипирование"
        data-figma-node={figmaNode}
      >
        {children}
      </div>
    </main>
  );
}
