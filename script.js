

const coinSelect = document.getElementById('coin-select');
const intervalSelect = document.getElementById('interval-select');
const chartElement = document.getElementById('candlestickChart');
let chart;
let ws;
let chartData = [];

// Initialize Chart.js
function initializeChart() {
    const ctx = chartElement.getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Close Price',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });
}

// Function to update chart data
function updateChart(data) {
    chart.data.labels.push(new Date(data.t).toLocaleTimeString());
    chart.data.datasets[0].data.push(data.c);
    chart.update();
}

// Handle WebSocket messages
function handleWebSocketMessage(event) {
    const message = JSON.parse(event.data);
    if (message.k) {
        const candleData = message.k;
        updateChart({
            t: candleData.t,  // Timestamp
            c: candleData.c   // Close Price
        });
        chartData.push(candleData);
    }
}

// Connect to WebSocket
function connectWebSocket(coin, interval) {
    if (ws) {
        ws.close();
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${coin}@kline_${interval}`;
    ws = new WebSocket(wsUrl);

    ws.onmessage = handleWebSocketMessage;
    ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        connectWebSocket(coin, interval);
    };
}

// Event Listener for Coin and Interval Changes
coinSelect.addEventListener('change', () => {
    const coin = coinSelect.value;
    const interval = intervalSelect.value;
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    connectWebSocket(coin, interval);
});

intervalSelect.addEventListener('change', () => {
    const coin = coinSelect.value;
    const interval = intervalSelect.value;
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    connectWebSocket(coin, interval);
});

// Initialize Chart and WebSocket Connection
window.onload = () => {
    initializeChart();
    connectWebSocket(coinSelect.value, intervalSelect.value);
};


