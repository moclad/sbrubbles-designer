import type { ReportItem, ReportProperties, CanvasRegion } from '../types';

export function exportToRDL(
  reportProperties: ReportProperties,
  regions: CanvasRegion[],
  items: ReportItem[]
): string {
  const { paperSize, orientation, margins, title, author } = reportProperties;
  
  // Calculate page dimensions (in inches for RDL)
  const pageSizes = {
    A4: { portrait: { width: 8.27, height: 11.69 }, landscape: { width: 11.69, height: 8.27 } },
    Letter: { portrait: { width: 8.5, height: 11 }, landscape: { width: 11, height: 8.5 } }
  };
  
  const pageSize = pageSizes[paperSize][orientation];
  const marginInInches = {
    top: margins.top / 72,
    right: margins.right / 72,
    bottom: margins.bottom / 72,
    left: margins.left / 72,
  };

  // Build XML
  let rdl = `<?xml version="1.0" encoding="utf-8"?>
<Report xmlns="http://schemas.microsoft.com/sqlserver/reporting/2008/01/reportdefinition" xmlns:rd="http://schemas.microsoft.com/SQLServer/reporting/reportdesigner">
  <Description>${escapeXml(title || 'Report')}</Description>
  <Author>${escapeXml(author || 'Report Designer')}</Author>
  <Width>${pageSize.width}in</Width>
  <PageHeight>${pageSize.height}in</PageHeight>
  <PageWidth>${pageSize.width}in</PageWidth>
  <LeftMargin>${marginInInches.left}in</LeftMargin>
  <RightMargin>${marginInInches.right}in</RightMargin>
  <TopMargin>${marginInInches.top}in</TopMargin>
  <BottomMargin>${marginInInches.bottom}in</BottomMargin>
  <Body>
    <Height>${regions.find(r => r.name === 'body')?.height || 500}pt</Height>
    <ReportItems>
`;

  // Add report items from body region
  const bodyItems = items.filter(item => item.region === 'body');
  bodyItems.forEach(item => {
    rdl += generateReportItem(item);
  });

  rdl += `    </ReportItems>
  </Body>
`;

  // Add page header if items exist
  const headerItems = items.filter(item => item.region === 'header');
  if (headerItems.length > 0) {
    rdl += `  <PageHeader>
    <Height>${regions.find(r => r.name === 'header')?.height || 100}pt</Height>
    <ReportItems>
`;
    headerItems.forEach(item => {
      rdl += generateReportItem(item);
    });
    rdl += `    </ReportItems>
  </PageHeader>
`;
  }

  // Add page footer if items exist
  const footerItems = items.filter(item => item.region === 'footer');
  if (footerItems.length > 0) {
    rdl += `  <PageFooter>
    <Height>${regions.find(r => r.name === 'footer')?.height || 100}pt</Height>
    <ReportItems>
`;
    footerItems.forEach(item => {
      rdl += generateReportItem(item);
    });
    rdl += `    </ReportItems>
  </PageFooter>
`;
  }

  rdl += `</Report>`;
  
  return rdl;
}

function generateReportItem(item: ReportItem): string {
  const props = item.properties;
  const xInInches = (item.x / 72).toFixed(3);
  const yInInches = (item.y / 72).toFixed(3);
  const widthInInches = ((props.width || 100) / 72).toFixed(3);
  const heightInInches = ((props.height || 30) / 72).toFixed(3);

  switch (item.pluginId) {
    case 'textbox':
    case 'singlefield':
      return `      <Textbox Name="${item.id}">
        <Top>${yInInches}in</Top>
        <Left>${xInInches}in</Left>
        <Width>${widthInInches}in</Width>
        <Height>${heightInInches}in</Height>
        <Value>${escapeXml(props.text || props.value || '')}</Value>
        <Style>
          <FontFamily>${props.fontFamily || 'Arial'}</FontFamily>
          <FontSize>${props.fontSize || 12}pt</FontSize>
          <FontWeight>${props.fontWeight === 'bold' ? 'Bold' : 'Normal'}</FontWeight>
          <FontStyle>${props.fontStyle === 'italic' ? 'Italic' : 'Normal'}</FontStyle>
          <TextAlign>${capitalizeFirst(props.textAlign || 'left')}</TextAlign>
          <Color>${props.color || props.valueColor || '#000000'}</Color>
          <BackgroundColor>${props.backgroundColor !== 'transparent' ? props.backgroundColor : 'Transparent'}</BackgroundColor>
        </Style>
      </Textbox>
`;

    case 'image':
      return `      <Image Name="${item.id}">
        <Top>${yInInches}in</Top>
        <Left>${xInInches}in</Left>
        <Width>${widthInInches}in</Width>
        <Height>${heightInInches}in</Height>
        <Source>External</Source>
        <Value>${escapeXml(props.src || '')}</Value>
        <Sizing>${props.objectFit === 'cover' ? 'FitProportional' : 'Fit'}</Sizing>
      </Image>
`;

    case 'table':
      return `      <Table Name="${item.id}">
        <Top>${yInInches}in</Top>
        <Left>${xInInches}in</Left>
        <Width>${widthInInches}in</Width>
        <Height>${heightInInches}in</Height>
        <DataSetName>DataSet1</DataSetName>
        <TableColumns>
${Array.from({ length: props.columns || 3 }, () => `          <TableColumn>
            <Width>${(props.width || 400) / (props.columns || 3)}pt</Width>
          </TableColumn>`).join('\n')}
        </TableColumns>
        <Header>
          <TableRows>
            <TableRow>
              <Height>25pt</Height>
              <TableCells>
${Array.from({ length: props.columns || 3 }, (_, colIdx) => `                <TableCell>
                  <ReportItems>
                    <Textbox>
                      <Value>Column ${colIdx + 1}</Value>
                      <Style>
                        <BackgroundColor>${props.headerColor || '#f0f0f0'}</BackgroundColor>
                        <FontWeight>Bold</FontWeight>
                      </Style>
                    </Textbox>
                  </ReportItems>
                </TableCell>`).join('\n')}
              </TableCells>
            </TableRow>
          </TableRows>
        </Header>
        <Details>
          <TableRows>
            <TableRow>
              <Height>20pt</Height>
              <TableCells>
${Array.from({ length: props.columns || 3 }, (_, colIdx) => `                <TableCell>
                  <ReportItems>
                    <Textbox>
                      <Value>Data ${colIdx + 1}</Value>
                    </Textbox>
                  </ReportItems>
                </TableCell>`).join('\n')}
              </TableCells>
            </TableRow>
          </TableRows>
        </Details>
      </Table>
`;

    case 'matrix':
    case 'qrcode':
      // For Matrix and QRCode, use a textbox placeholder
      return `      <Textbox Name="${item.id}">
        <Top>${yInInches}in</Top>
        <Left>${xInInches}in</Left>
        <Width>${widthInInches}in</Width>
        <Height>${heightInInches}in</Height>
        <Value>${escapeXml(item.pluginId === 'qrcode' ? props.value || '' : 'Matrix')}</Value>
        <Style>
          <Border>
            <Style>Solid</Style>
          </Border>
        </Style>
      </Textbox>
`;

    default:
      return '';
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function downloadRDL(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSON(filename: string, data: any): void {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function loadJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
