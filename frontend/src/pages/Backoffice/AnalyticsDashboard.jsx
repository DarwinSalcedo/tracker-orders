import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Loader, TrendingUp, Users, Package, Clock } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics/dashboard');
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader className="spin" /></div>;
    if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
    if (!data) return null;

    // Transform status data for charts
    const pieData = data.statusDistribution.map(item => ({
        name: item.label,
        value: parseInt(item.count, 10)
    }));

    // Transform weekly volume
    const barData = data.weeklyVolume.map(item => ({
        name: item.day.trim(), // 'Monday ', etc
        orders: parseInt(item.count, 10)
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '10px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Delivery Time</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{data.avgDeliveryTime}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '10px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Weekly Orders</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                                {barData.reduce((acc, curr) => acc + curr.orders, 0)}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Weekly Volume */}
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} /> Weekly Volume
                    </h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={20} /> Order Status
                    </h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Top Drivers */}
            <Card>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={20} /> Top Delivery Persons
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#666', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Rank</th>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Completed Deliveries</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topDrivers.length > 0 ? (
                                data.topDrivers.map((driver, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: '#888' }}>#{index + 1}</td>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{driver.username}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#3b82f6' }}>{driver.deliveries}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;
