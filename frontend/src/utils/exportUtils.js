import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const fetchAllCostData = async () => {
  try {
    const [materialsRes, laborRes, miscRes, electricalRes, plumbingRes, tilesLaborRes] = await Promise.all([
      axios.get(`${API_BASE}/materials`),
      axios.get(`${API_BASE}/labor-costs`),
      axios.get(`${API_BASE}/misc-costs`),
      axios.get(`${API_BASE}/electrical-costs`),
      axios.get(`${API_BASE}/plumbing-costs`),
      axios.get(`${API_BASE}/tiles-labor`),
    ]);

    return {
      materials: materialsRes.data,
      laborCosts: laborRes.data,
      miscCosts: miscRes.data,
      electricalCosts: electricalRes.data,
      plumbingCosts: plumbingRes.data,
      tilesLabor: tilesLaborRes.data,
    };
  } catch (err) {
    console.error('Failed to fetch cost data:', err);
    throw err;
  }
};

const calculateTotals = (data) => {
  return data.reduce((sum, item) => {
    const amount = item.amount || item.paid_amount || item.price || 0;
    return sum + parseFloat(amount || 0);
  }, 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const generateTableHTML = (title, data, columns) => {
  if (data.length === 0) return '';

  let html = `<h3 style="margin-top: 20px; margin-bottom: 10px; color: #1e40af; font-size: 16px;">${title}</h3>`;
  html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
  
  html += '<thead><tr style="background-color: #e0e7ff; border: 1px solid #c7d2fe;">';
  columns.forEach(col => {
    const header = col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ');
    html += `<th style="padding: 10px; text-align: left; border: 1px solid #c7d2fe; font-weight: bold;">${header}</th>`;
  });
  html += '</tr></thead>';

  html += '<tbody>';
  data.forEach(item => {
    html += '<tr style="border: 1px solid #e5e7eb;">';
    columns.forEach(col => {
      let value = '';
      if (col === 'date') {
        value = formatDate(item.date);
      } else if (col === 'amount' || col === 'paid_amount' || col === 'price') {
        value = `Tk ${parseFloat(item[col] || 0).toFixed(2)}`;
      } else {
        value = item[col] || '-';
      }
      html += `<td style="padding: 10px; border: 1px solid #e5e7eb;">${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  return html;
};

export const generatePDF = async (costData) => {
  const { default: html2pdf } = await import('html2pdf.js');

  const materialTotal = calculateTotals(costData.materials);
  const laborTotal = calculateTotals(costData.laborCosts);
  const miscTotal = calculateTotals(costData.miscCosts);
  const electricalTotal = calculateTotals(costData.electricalCosts);
  const plumbingTotal = calculateTotals(costData.plumbingCosts);
  const tilesLaborTotal = calculateTotals(costData.tilesLabor);
  const grandTotal = materialTotal + laborTotal + miscTotal + electricalTotal + plumbingTotal + tilesLaborTotal;

  let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #1e40af;">Cost Management Report</h1>
        <p style="margin: 5px 0; color: #666;">Generated on: ${formatDate(new Date())}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 15px; margin-bottom: 20px; border-left: 4px solid #1e40af;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px;"><strong>Category</strong></td>
            <td style="text-align: right; padding: 8px;"><strong>Total Cost</strong></td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Materials</td>
            <td style="text-align: right; padding: 8px;">Tk ${materialTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Labor Cost</td>
            <td style="text-align: right; padding: 8px;">Tk ${laborTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Miscellaneous</td>
            <td style="text-align: right; padding: 8px;">Tk ${miscTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Electrical</td>
            <td style="text-align: right; padding: 8px;">Tk ${electricalTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Plumbing</td>
            <td style="text-align: right; padding: 8px;">Tk ${plumbingTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px solid #bfdbfe;">
            <td style="padding: 8px;">Tiles Labor</td>
            <td style="text-align: right; padding: 8px;">Tk ${tilesLaborTotal.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #1e40af; background-color: #dbeafe; font-weight: bold;">
            <td style="padding: 10px;">GRAND TOTAL</td>
            <td style="text-align: right; padding: 10px; color: #1e40af; font-size: 18px;">Tk ${grandTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="page-break-inside: avoid;">
        ${generateTableHTML('Materials Details', costData.materials, ['date', 'price', 'quantity'])}
        ${generateTableHTML('Labor Costs Details', costData.laborCosts, ['date', 'amount', 'description'])}
        ${generateTableHTML('Miscellaneous Costs Details', costData.miscCosts, ['date', 'price', 'category'])}
        ${generateTableHTML('Electrical Costs Details', costData.electricalCosts, ['date', 'amount', 'details'])}
        ${generateTableHTML('Plumbing Costs Details', costData.plumbingCosts, ['date', 'amount', 'description'])}
        ${generateTableHTML('Tiles Labor Details', costData.tilesLabor, ['date', 'paid_amount'])}
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  const opt = {
    margin: 10,
    filename: `Cost-Report-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  html2pdf().set(opt).from(element).save();
};

export const generateExcel = async (costData) => {
  const { default: XLSX } = await import('xlsx');

  const materialTotal = calculateTotals(costData.materials);
  const laborTotal = calculateTotals(costData.laborCosts);
  const miscTotal = calculateTotals(costData.miscCosts);
  const electricalTotal = calculateTotals(costData.electricalCosts);
  const plumbingTotal = calculateTotals(costData.plumbingCosts);
  const tilesLaborTotal = calculateTotals(costData.tilesLabor);
  const grandTotal = materialTotal + laborTotal + miscTotal + electricalTotal + plumbingTotal + tilesLaborTotal;

  const workbook = XLSX.utils.book_new();

  const summaryData = [
    { Category: 'Materials', Total: materialTotal },
    { Category: 'Labor Cost', Total: laborTotal },
    { Category: 'Miscellaneous', Total: miscTotal },
    { Category: 'Electrical', Total: electricalTotal },
    { Category: 'Plumbing', Total: plumbingTotal },
    { Category: 'Tiles Labor', Total: tilesLaborTotal },
    { Category: 'GRAND TOTAL', Total: grandTotal },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const formatSheetData = (data, columns) => {
    return data.map(item => {
      const row = {};
      columns.forEach(col => {
        if (col === 'date') {
          row[col] = formatDate(item.date);
        } else if (col === 'amount' || col === 'paid_amount' || col === 'price') {
          row[col] = parseFloat(item[col] || 0);
        } else {
          row[col] = item[col] || '-';
        }
      });
      return row;
    });
  };

  if (costData.materials.length > 0) {
    const materialsSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.materials, ['date', 'price', 'quantity']));
    XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Materials');
  }

  if (costData.laborCosts.length > 0) {
    const laborSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.laborCosts, ['date', 'amount', 'description']));
    XLSX.utils.book_append_sheet(workbook, laborSheet, 'Labor Costs');
  }

  if (costData.miscCosts.length > 0) {
    const miscSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.miscCosts, ['date', 'price', 'category']));
    XLSX.utils.book_append_sheet(workbook, miscSheet, 'Miscellaneous');
  }

  if (costData.electricalCosts.length > 0) {
    const electricalSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.electricalCosts, ['date', 'amount', 'details']));
    XLSX.utils.book_append_sheet(workbook, electricalSheet, 'Electrical');
  }

  if (costData.plumbingCosts.length > 0) {
    const plumbingSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.plumbingCosts, ['date', 'amount', 'description']));
    XLSX.utils.book_append_sheet(workbook, plumbingSheet, 'Plumbing');
  }

  if (costData.tilesLabor.length > 0) {
    const tilesSheet = XLSX.utils.json_to_sheet(formatSheetData(costData.tilesLabor, ['date', 'paid_amount']));
    XLSX.utils.book_append_sheet(workbook, tilesSheet, 'Tiles Labor');
  }

  XLSX.writeFile(workbook, `Cost-Report-${new Date().toISOString().split('T')[0]}.xlsx`);
};
