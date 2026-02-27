import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTenant = () => {
    const { id } = useParams(); // Get tenant ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{
        firstName: string,
        lastName: string,
        email: string,
        address: string
    }>({
        firstName: '',
        lastName: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState<string | null>(null); // State for error handling

    // Fetch tenant details for editing
    useEffect(() => {
        const fetchTenantDetails = async () => {
            try {
                const response = await axios.get(`/api/tenants/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch tenant details");
                setLoading(false);
            }
        };

        fetchTenantDetails();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/tenants/${id}`, formData); // Update tenant details
            navigate(`/tenant-details/${id}`); // Navigate back to tenant details
        } catch (err) {
            alert("Failed to save changes");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-tenant">
            <h1>Edit Tenant</h1>
            <form>
                <label>
                    First Name:
                    <input
                        name="firstName"
                        value={formData?.firstName}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        name="lastName"
                        value={formData?.lastName}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        name="email"
                        value={formData?.email}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Address:
                    <input
                        name="address"
                        value={formData?.address}
                        onChange={handleInputChange}
                    />
                </label>
            </form>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default EditTenant;
