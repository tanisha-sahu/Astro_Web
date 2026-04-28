import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    ChevronLeft, Package, Truck, CreditCard, 
    User, MapPin, Calendar, Clock, CheckCircle,
    Download, Printer
} from 'lucide-react';
import { orderService } from '../services';
import { IMAGE_BASE_URL } from '../api/axiosInstance';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardOrderDetailPage.css';

const DashboardOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await orderService.fetchOrderById(id);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details');
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardSkeleton type="dashboard" />
            </DashboardLayout>
        );
    }

    if (error || !order) {
        return (
            <DashboardLayout>
                <div className="error-state">
                    <h3>Error</h3>
                    <p>{error || 'Order not found'}</p>
                    <button className="back-btn" onClick={() => navigate('/dashboard/orders')}>
                        <ChevronLeft size={18} /> Back to Orders
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const steps = [
        { status: 'Pending', label: 'Order Placed', time: order.createdAt },
        { status: 'Processing', label: 'Processing', time: order.updatedAt },
        { status: 'Shipped', label: 'Shipped', time: order.updatedAt },
        { status: 'Delivered', label: 'Delivered', time: order.updatedAt }
    ];

    const currentStatusIndex = steps.findIndex(s => s.status === order.status);

    return (
        <DashboardLayout>
            <div className="order-detail-container">
                <header className="order-detail-header">
                    <div className="header-left">
                        <div className="order-main-info">
                            <h1>Order {order.orderNumber}</h1>
                            <div className="order-meta">
                                <span><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                                <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="back-btn"><Printer size={18} /> Print Invoice</button>
                    </div>
                </header>

                <div className="order-detail-grid">
                    <div className="main-content">
                        {/* Items Card */}
                        <div className="detail-card">
                            <h3><Package size={20} /> Items Ordered</h3>
                            <div className="order-items-list">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <div className="item-img-wrapper">
                                            <img 
                                                src={item.image?.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`} 
                                                alt={item.name} 
                                            />
                                        </div>
                                        <div className="item-info">
                                            <h4>{item.name}</h4>
                                            <p>Qty: {item.qty}</p>
                                        </div>
                                        <div className="item-price-calc">
                                            <span className="unit-price">₹{item.price.toLocaleString()} × {item.qty}</span>
                                            <span className="total-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pricing-summary">
                                <div className="summary-line">
                                    <span>Subtotal</span>
                                    <span>₹{order.itemsPrice?.toLocaleString()}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingPrice?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Tax</span>
                                    <span>₹{order.taxPrice?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="summary-line grand-total">
                                    <span>Total</span>
                                    <span>₹{order.totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="detail-card">
                            <h3><Truck size={20} /> Order Progress</h3>
                            <div className="status-timeline">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={`timeline-item ${idx <= currentStatusIndex ? 'active' : ''}`}>
                                        <div className="timeline-icon">
                                            {idx <= currentStatusIndex ? <CheckCircle size={14} /> : (idx + 1)}
                                        </div>
                                        <div className="timeline-content">
                                            <h5>{step.label}</h5>
                                            <p>{idx <= currentStatusIndex ? `Completed on ${new Date(step.time).toLocaleDateString()}` : 'Pending'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="side-content">
                        {/* Customer Info */}
                        <div className="detail-card">
                            <h3><User size={20} /> Customer Details</h3>
                            <div className="info-section">
                                <span className="info-label">Name</span>
                                <span className="info-value">{order.user?.firstName} {order.user?.lastName}</span>
                            </div>
                            <div className="info-section">
                                <span className="info-label">Email</span>
                                <span className="info-value">{order.user?.email}</span>
                            </div>
                            <div className="info-section">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{order.user?.mobile || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="detail-card">
                            <h3><MapPin size={20} /> Shipping Address</h3>
                            <div className="address-block">
                                <span className="info-value">
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="detail-card">
                            <h3><CreditCard size={20} /> Payment</h3>
                            <div className="info-section">
                                <span className="info-label">Method</span>
                                <span className="info-value">{order.paymentMethod}</span>
                            </div>
                            <div className="info-section">
                                <span className="info-label">Status</span>
                                <span className={`status-tag ${order.isPaid ? 'delivered' : 'pending'}`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                            {order.paidAt && (
                                <div className="info-section">
                                    <span className="info-label">Paid At</span>
                                    <span className="info-value">{new Date(order.paidAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardOrderDetailPage;
