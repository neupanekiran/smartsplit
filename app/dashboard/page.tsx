"use client";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import "tailwindcss/tailwind.css";
import { useState, useEffect } from 'react';
import Topbar from '../Topbar';
import Navbar from '../Navbar';

const Dashboard = () => {
    const [timeframe, setTimeframe] = useState('monthly');
    const [theme, setTheme] = useState('nord');  // Default theme

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'nord' ? 'dim' : 'nord'));
    };

    // Data (unchanged)
    const monthlyBarData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                label: "Expenses",
                data: [400, 300, 500, 200, 450],
                backgroundColor: "rgba(99, 102, 241, 0.7)", // Slightly transparent indigo
                borderRadius: 5,
            },
        ],
    };

    const weeklyBarData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Expenses",
                data: [200, 150, 250, 100],
                backgroundColor: "rgba(99, 102, 241, 0.7)",
                borderRadius: 5,
            },
        ],
    };

    const lineData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Savings Progress",
                data: [100, 200, 300, 500],
                borderColor: "#4ADE80",
                backgroundColor: 'rgba(77, 222, 128, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const expenseCategories = [
        { name: 'Food', value: 70, color: '#F472B6' },
        { name: 'Transport', value: 50, color: '#38BDF8' },
        { name: 'Entertainment', value: 30, color: '#A78BFA' },
        { name: 'Utilities', value: 80, color: '#FBBF24' },
    ];

    const doughnutData = {
        labels: expenseCategories.map(cat => cat.name),
        datasets: [
            {
                data: expenseCategories.map(cat => cat.value),
                backgroundColor: expenseCategories.map(cat => cat.color),
                borderWidth: 0,
                hoverOffset: 5,
            },
        ],
    };

    // Dummy activity log data
    const activityLog = [
        { id: 1, date: '2025-02-11', description: 'Netflix Subscription', amount: -15.99 },
        { id: 2, date: '2025-02-10', description: 'Salary Deposit', amount: 5000.00 },
        { id: 3, date: '2025-02-09', description: 'Groceries', amount: -75.50 },
        { id: 4, date: '2025-02-08', description: 'Dinner with Friends', amount: -45.00 },
    ];

    return (
        <>
        <Topbar/>
        <div className="min-h-screen py-8 font-sans bg-base-200 text-base-content" data-theme={theme}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">SpendWise Dashboard</h1>
                    <div className="space-x-2 flex items-center">
                        <button
                            className={`btn btn-sm px-3 py-2 rounded-full  ${timeframe === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeframe('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`btn btn-sm px-3 py-2 rounded-full ${timeframe === 'weekly' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeframe('weekly')}
                        >
                            Weekly
                        </button>

                        {/* Theme Toggle */}
                        <label className="swap swap-rotate">
                            <input
                                type="checkbox"
                                className="theme-controller"
                                value="dim"
                                checked={theme === 'dim'}
                                onChange={toggleTheme}
                            />
                            {/* Sun icon */}
                            <svg
                                className="swap-off h-6 w-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            {/* Moon icon */}
                            <svg
                                className="swap-on h-6 w-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column (Charts) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Expenses Over Time</h2>
                                <Bar
                                    data={timeframe === 'monthly' ? monthlyBarData : weeklyBarData}
                                    options={{
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                            },
                                            y: {
                                                grid: { display: true },
                                                beginAtZero: true,
                                            },
                                        },
                                        plugins: {
                                            legend: { display: false },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Savings Growth</h2>
                                <Line
                                    data={lineData}
                                    options={{
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                            },
                                            y: {
                                                grid: { display: true },
                                                beginAtZero: true,
                                            },
                                        },
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Pie Chart and Account Summary) */}
                    <div className="space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Spending Breakdown</h2>
                                <div style={{ height: '200px' }}>
                                    <Doughnut
                                        data={doughnutData}
                                        options={{
                                            cutout: '70%',
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    align: 'center',
                                                    labels: {
                                                        boxWidth: 12,
                                                        usePointStyle: true,
                                                        pointStyle: 'rectRounded',
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Account Summary</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-xl shadow-sm">
                                        <p className="text-gray-600 text-sm">Total Income</p>
                                        <p className="text-2xl font-bold text-green-600">$5,000</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl shadow-sm">
                                        <p className="text-gray-600 text-sm">Total Expenses</p>
                                        <p className="text-2xl font-bold text-red-600">$2,500</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm col-span-2">
                                        <p className="text-gray-600 text-sm">Account Balance</p>
                                        <p className="text-3xl font-bold text-blue-600">$2,500</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="card bg-base-100 shadow-xl mt-6">
                    <div className="card-body">
                        <h2 className="card-title">Activity Log</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLog.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.date}</td>
                                            <td>{log.description}</td>
                                            <td className={log.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                                                {log.amount > 0 ? '+' : '-'} ${Math.abs(log.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Rewards and Gamification */}
                <div className="card bg-base-100 shadow-xl mt-6">
                    <div className="card-body">
                        <h2 className="card-title">Rewards and Gamification</h2>
                        <div className="flex items-center justify-around">
                            <div className="text-center">
                                <span className="text-4xl text-yellow-500">⭐</span>
                                <p className="text-gray-500 text-sm">500 Stars</p>
                            </div>
                            <div className="text-center">
                                <span className="text-4xl text-blue-500">🏆</span>
                                <p className="text-gray-500 text-sm">12 Badges</p>
                            </div>
                            <div className="text-center">
                                <span className="text-4xl text-green-500">🏅</span>
                                <p className="text-gray-500 text-sm">Level 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Navbar/>
        </>
    );
};

export default Dashboard;
