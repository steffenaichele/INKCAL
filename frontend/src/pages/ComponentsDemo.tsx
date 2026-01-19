import { Button } from '@/components/ui';

export function ComponentsDemo() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1>Base UI Components Demo</h1>

      <section className="section">
        <h2>Buttons</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ width: '100%' }}>Variants</h3>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ width: '100%' }}>Sizes</h3>
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <h3 style={{ width: '100%' }}>States</h3>
          <Button disabled>Disabled Button</Button>
          <Button loading>Loading Button</Button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Full Width</h3>
          <Button fullWidth>Full Width Button</Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ width: '100%' }}>With Icons (example)</h3>
          <Button variant="primary">
            <span>✓</span>
            <span>Save</span>
          </Button>
          <Button variant="outline">
            <span>✕</span>
            <span>Cancel</span>
          </Button>
        </div>
      </section>

      <section className="section">
        <h2>Typography</h2>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>This is a paragraph with some <a href="#">link text</a>. It demonstrates the default paragraph styling.</p>
        <p className="text-muted">This is muted text for less important information.</p>
      </section>

      <section className="section">
        <h2>Spacing Utilities</h2>
        <div style={{ background: '#f0f0f0', padding: '1rem' }}>
          <div className="mt-4 mb-4" style={{ background: '#fff', padding: '1rem' }}>
            Margin top and bottom (mt-4, mb-4)
          </div>
          <div className="pt-4 pb-4" style={{ background: '#fff' }}>
            Padding top and bottom (pt-4, pb-4)
          </div>
        </div>
      </section>
    </div>
  );
}
