# How to Use useLandlordOperations Hook

## Overview

The `useLandlordOperations` hook provides a React-friendly way to interact with landlord APIs with built-in error handling, loading states, and success callbacks.

## Benefits of Using the Hook

### ✅ **Using useLandlordOperations Hook (Recommended)**

```tsx
import { useLandlordOperations } from "../../../../apis/landlordApi";

const MyComponent = () => {
  const {
    getListedProperties,
    getTransactionStatistics,
    createProperty,
    updateProperty,
  } = useLandlordOperations();

  const handleFetchProperties = async () => {
    try {
      // The hook automatically handles loading states and error handling
      const properties = await getListedProperties();
      console.log("Properties:", properties);
      // Success notification is automatically shown if configured
    } catch (error) {
      // Error is automatically handled and shown to user
      console.error("Error fetched properties:", error);
    }
  };

  const handleCreateProperty = async (propertyData) => {
    try {
      const result = await createProperty(propertyData);
      // Success message: "Property created successfully!" is automatically shown
      // onSuccess callback is automatically called
      console.log("Property created:", result);
    } catch (error) {
      // Validation errors are automatically handled
      // Custom error messages are automatically shown
    }
  };
};
```

### ❌ **Direct API Import (Old Way)**

```tsx
import {
  getListedProperties as getListedPropertiesApi,
  createProperty as createPropertyApi,
} from "../../../../apis/landlordApi";

const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const properties = await getListedPropertiesApi();

      // You need to manually handle success states
      // You need to manually show notifications
      console.log("Properties:", properties);
    } catch (error) {
      // You need to manually handle errors
      // You need to manually show error messages
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
};
```

## Key Differences

| Feature               | useLandlordOperations Hook       | Direct API Import       |
| --------------------- | -------------------------------- | ----------------------- |
| **Error Handling**    | ✅ Automatic                     | ❌ Manual               |
| **Loading States**    | ✅ Built-in via executeOperation | ❌ Manual               |
| **Success Messages**  | ✅ Automatic notifications       | ❌ Manual               |
| **Validation Errors** | ✅ Automatic handling            | ❌ Manual               |
| **Consistency**       | ✅ Consistent across app         | ❌ Varies per component |
| **Code Reduction**    | ✅ Less boilerplate              | ❌ More boilerplate     |

## Available Hook Functions

### Property Operations

- `createProperty(propertyData)` - Creates property with success notification
- `savePropertyDraft(draftData)` - Saves draft with success feedback
- `getListedProperties()` - Fetches properties with error handling
- `getProperty(propertyId)` - Gets single property
- `updateProperty(propertyId, updateData)` - Updates with success notification
- `deleteProperty(propertyId)` - Deletes with success feedback

### Application Operations

- `getAllApplications(params)` - Fetches applications with pagination
- `getApplication(propertyId, applicationId)` - Gets single application
- `getApplicants()` - Fetches all applicants
- `getApplicationStats()` - Gets application statistics

### Transaction Operations

- `getAllTransactions()` - Fetches all transactions
- `getTransactionStatistics()` - Gets financial statistics
- `getTransaction(propertyId, transactionId)` - Gets single transaction

## Real-World Usage Example

```tsx
import React, { useEffect, useState } from "react";
import { useLandlordOperations } from "../apis/landlordApi";

const PropertyDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);

  const {
    getListedProperties,
    getTransactionStatistics,
    createProperty,
    deleteProperty,
  } = useLandlordOperations();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, statsData] = await Promise.all([
          getListedProperties(),
          getTransactionStatistics(),
        ]);

        setProperties(propertiesData);
        setStats(statsData);
      } catch (error) {
        // Errors are automatically handled by the hook
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchData();
  }, [getListedProperties, getTransactionStatistics]);

  const handleCreateProperty = async (formData) => {
    try {
      await createProperty(formData);
      // Success notification is automatically shown
      // Refresh the properties list
      const updatedProperties = await getListedProperties();
      setProperties(updatedProperties);
    } catch (error) {
      // Validation errors are automatically shown to user
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await deleteProperty(propertyId);
      // Success notification is automatically shown
      // Remove from local state
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      // Error is automatically shown to user
    }
  };

  return (
    <div>
      <h1>Properties Dashboard</h1>

      {/* Property Statistics */}
      {stats && (
        <div className="stats-cards">
          <div>Total Balance: ₦{stats.total_balance?.toLocaleString()}</div>
          <div>
            Expected Earnings: ₦{stats.expected_earnings?.toLocaleString()}
          </div>
        </div>
      )}

      {/* Properties List */}
      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <h3>{property.name}</h3>
            <p>{property.description}</p>
            <button onClick={() => handleDeleteProperty(property.id)}>
              Delete Property
            </button>
          </div>
        ))}
      </div>

      {/* Create Property Form */}
      <PropertyForm onSubmit={handleCreateProperty} />
    </div>
  );
};
```

## Migration Guide

To migrate from direct API imports to the hook:

1. **Replace imports:**

   ```tsx
   // Old
   import { getListedProperties, createProperty } from "../apis/landlordApi";

   // New
   import { useLandlordOperations } from "../apis/landlordApi";
   ```

2. **Add hook to component:**

   ```tsx
   const { getListedProperties, createProperty } = useLandlordOperations();
   ```

3. **Remove manual loading/error state management:**

   ```tsx
   // Remove these if using hook
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   ```

4. **Simplify API calls:**

   ```tsx
   // Old
   const fetchData = async () => {
     setLoading(true);
     try {
       const data = await getListedPropertiesApi();
       // handle success
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   // New
   const fetchData = async () => {
     try {
       const data = await getListedProperties();
       // handle success - errors are automatically handled
     } catch (err) {
       // Only handle specific business logic if needed
     }
   };
   ```

## Best Practices

1. **Always use the hook for new components**
2. **Migrate existing components gradually**
3. **Let the hook handle standard error/success cases**
4. **Only add custom error handling for specific business logic**
5. **Use async/await pattern for better readability**
6. **Leverage the built-in success notifications**

This approach provides a much cleaner, more maintainable codebase with consistent error handling and user feedback across your application.
