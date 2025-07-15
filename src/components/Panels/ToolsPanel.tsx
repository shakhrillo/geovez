import React, { useState } from 'react';
import { 
  CalciteIcon, 
  CalciteButton, 
  CalciteList, 
  CalciteListItem,
  CalciteChip,
  CalciteBlock,
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteTooltip
} from '@esri/calcite-components-react';

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'measurement' | 'drawing' | 'analysis' | 'navigation';
  status: 'available' | 'beta' | 'coming-soon';
  shortcut?: string;
}

const ToolsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools: Tool[] = [
    // Measurement Tools
    { 
      id: 'measure-distance', 
      icon: 'measure', 
      title: 'Measure Distance', 
      description: 'Measure distances between points on the map',
      category: 'measurement',
      status: 'available',
      shortcut: 'M'
    },
    { 
      id: 'measure-area', 
      icon: 'polygon', 
      title: 'Measure Area', 
      description: 'Calculate areas of polygons and regions',
      category: 'measurement',
      status: 'available',
      shortcut: 'A'
    },
    { 
      id: 'elevation-profile', 
      icon: 'line-chart', 
      title: 'Elevation Profile', 
      description: 'View elevation changes along a path',
      category: 'measurement',
      status: 'beta'
    },
    
    // Drawing Tools
    { 
      id: 'draw-point', 
      icon: 'point', 
      title: 'Draw Points', 
      description: 'Add point markers to the map',
      category: 'drawing',
      status: 'available',
      shortcut: 'P'
    },
    { 
      id: 'draw-line', 
      icon: 'line', 
      title: 'Draw Lines', 
      description: 'Draw lines and polylines on the map',
      category: 'drawing',
      status: 'available',
      shortcut: 'L'
    },
    { 
      id: 'draw-polygon', 
      icon: 'polygon', 
      title: 'Draw Polygons', 
      description: 'Create polygon shapes and areas',
      category: 'drawing',
      status: 'available'
    },
    { 
      id: 'text-annotation', 
      icon: 'text', 
      title: 'Text Annotation', 
      description: 'Add text labels and annotations',
      category: 'drawing',
      status: 'available'
    },
    
    // Analysis Tools
    { 
      id: 'buffer', 
      icon: 'buffer', 
      title: 'Buffer Analysis', 
      description: 'Create buffer zones around features',
      category: 'analysis',
      status: 'available'
    },
    { 
      id: 'viewshed', 
      icon: 'viewshed', 
      title: 'Viewshed Analysis', 
      description: 'Calculate visible areas from a point',
      category: 'analysis',
      status: 'beta'
    },
    { 
      id: 'watershed', 
      icon: 'watershed', 
      title: 'Watershed Analysis', 
      description: 'Delineate watershed boundaries',
      category: 'analysis',
      status: 'coming-soon'
    },
    
    // Navigation Tools
    { 
      id: 'coordinate-finder', 
      icon: 'pin-tear', 
      title: 'Coordinate Finder', 
      description: 'Find and display coordinates',
      category: 'navigation',
      status: 'available'
    },
    { 
      id: 'goto-coordinates', 
      icon: 'navigation', 
      title: 'Go to Coordinates', 
      description: 'Navigate to specific coordinates',
      category: 'navigation',
      status: 'available'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tools', icon: 'apps' },
    { id: 'measurement', label: 'Measurement', icon: 'measure' },
    { id: 'drawing', label: 'Drawing', icon: 'pencil' },
    { id: 'analysis', label: 'Analysis', icon: 'analysis' },
    { id: 'navigation', label: 'Navigation', icon: 'navigation' }
  ];

  const handleToolLaunch = (tool: Tool) => {
    if (tool.status === 'coming-soon') {
      console.log(`Tool ${tool.title} is coming soon`);
      return;
    }
    
    console.log(`Launching tool: ${tool.id}`);
    // Add tool launch logic here based on tool type
    switch (tool.category) {
      case 'measurement':
        // Initialize measurement tools
        break;
      case 'drawing':
        // Initialize drawing tools
        break;
      case 'analysis':
        // Initialize analysis tools
        break;
      case 'navigation':
        // Initialize navigation tools
        break;
    }
  };

  const getStatusChip = (status: Tool['status']) => {
    const statusConfig = {
      'available': { color: 'green', text: 'Ready' },
      'beta': { color: 'yellow', text: 'Beta' },
      'coming-soon': { color: 'gray', text: 'Soon' }
    };
    
    const config = statusConfig[status];
    return (
      <CalciteChip 
        scale="s" 
        color={config.color as any}
        style={{ marginLeft: '0.5rem' }}
      >
        {config.text}
      </CalciteChip>
    );
  };

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  const toolsByCategory = categories.slice(1).map(category => ({
    ...category,
    tools: tools.filter(tool => tool.category === category.id),
    count: tools.filter(tool => tool.category === category.id).length
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <CalciteBlock 
        heading="Map Tools" 
        description="Access powerful mapping and analysis tools to enhance your workflow"
        collapsible={false}
      >
        <CalciteIcon icon="apps" slot="icon" />
        
        {/* Category Filter */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {categories.map(category => (
              <CalciteButton
                key={category.id}
                scale="s"
                appearance={activeCategory === category.id ? 'solid' : 'outline'}
                iconStart={category.icon}
                onClick={() => setActiveCategory(category.id)}
                style={{ flex: '1', minWidth: 'fit-content' }}
              >
                {category.label}
                {category.id !== 'all' && (
                  <span style={{ marginLeft: '0.25rem', opacity: 0.7 }}>
                    ({tools.filter(t => t.category === category.id).length})
                  </span>
                )}
              </CalciteButton>
            ))}
          </div>
        </div>

        {/* Tools List */}
        {activeCategory === 'all' ? (
          <CalciteAccordion>
            {toolsByCategory.map(category => (
              <CalciteAccordionItem
                key={category.id}
                itemTitle={`${category.label} (${category.count})`}
                expanded={category.id === 'measurement'}
              >
                <CalciteIcon icon={category.icon} slot="actions-start" />
                <CalciteList>
                  {category.tools.map(tool => (
                    <CalciteListItem
                      key={tool.id}
                      label={tool.title}
                      description={tool.description}
                      disabled={tool.status === 'coming-soon'}
                    >
                      <div slot="content-start" style={{ display: 'flex', alignItems: 'center' }}>
                        <CalciteIcon 
                          icon={tool.icon} 
                          scale="s"
                          style={{
                            background: tool.status === 'coming-soon' 
                              ? 'var(--calcite-color-border-2)' 
                              : 'linear-gradient(135deg, var(--geovez-primary), var(--geovez-primary-dark))',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '8px',
                            marginRight: '0.5rem'
                          }}
                        />
                        {tool.shortcut && (
                          <CalciteTooltip referenceElement={`tool-${tool.id}`}>
                            Keyboard shortcut: {tool.shortcut}
                          </CalciteTooltip>
                        )}
                      </div>
                      
                      <div slot="content-end" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusChip(tool.status)}
                        <CalciteButton 
                          id={`tool-${tool.id}`}
                          appearance="outline"
                          iconStart={tool.status === 'coming-soon' ? 'clock' : 'play'}
                          scale="s"
                          disabled={tool.status === 'coming-soon'}
                          onClick={() => handleToolLaunch(tool)}
                        >
                          {tool.status === 'coming-soon' ? 'Soon' : 'Launch'}
                        </CalciteButton>
                      </div>
                    </CalciteListItem>
                  ))}
                </CalciteList>
              </CalciteAccordionItem>
            ))}
          </CalciteAccordion>
        ) : (
          <CalciteList>
            {filteredTools.map(tool => (
              <CalciteListItem
                key={tool.id}
                label={tool.title}
                description={tool.description}
                disabled={tool.status === 'coming-soon'}
              >
                <div slot="content-start" style={{ display: 'flex', alignItems: 'center' }}>
                  <CalciteIcon 
                    icon={tool.icon} 
                    scale="s"
                    style={{
                      background: tool.status === 'coming-soon' 
                        ? 'var(--calcite-color-border-2)' 
                        : 'linear-gradient(135deg, var(--geovez-primary), var(--geovez-primary-dark))',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '8px',
                      marginRight: '0.5rem'
                    }}
                  />
                  {tool.shortcut && (
                    <CalciteTooltip referenceElement={`tool-${tool.id}`}>
                      Keyboard shortcut: {tool.shortcut}
                    </CalciteTooltip>
                  )}
                </div>
                
                <div slot="content-end" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusChip(tool.status)}
                  <CalciteButton 
                    id={`tool-${tool.id}`}
                    appearance="outline"
                    iconStart={tool.status === 'coming-soon' ? 'clock' : 'play'}
                    scale="s"
                    disabled={tool.status === 'coming-soon'}
                    onClick={() => handleToolLaunch(tool)}
                  >
                    {tool.status === 'coming-soon' ? 'Soon' : 'Launch'}
                  </CalciteButton>
                </div>
              </CalciteListItem>
            ))}
          </CalciteList>
        )}
      </CalciteBlock>
    </div>
  );
};

export default ToolsPanel;
