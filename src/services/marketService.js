const market = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 180.25, change: 1.42 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 420.18, change: -0.63 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 875.40, change: 2.85 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 182.14, change: 0.91 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', price: 175.98, change: -0.34 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer', price: 171.05, change: 1.76 },
];

function historyFor(stock) {
  const points = [];
  for (let index = 13; index >= 0; index -= 1) {
    const variation = Math.sin(index * 1.7 + stock.price) * (stock.price * 0.012);
    points.push({ timestamp: new Date(Date.now() - index * 86400000).toISOString(), price: Number((stock.price - variation).toFixed(2)) });
  }
  return points;
}

function list(search = '') {
  const query = search.trim().toUpperCase();
  return market.filter((stock) => !query || stock.symbol.includes(query) || stock.name.toUpperCase().includes(query) || stock.sector.toUpperCase().includes(query));
}

function get(symbol) {
  return market.find((stock) => stock.symbol === symbol.toUpperCase());
}

module.exports = { get, historyFor, list };
