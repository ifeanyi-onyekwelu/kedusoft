import { useMemo, useState } from "react";
import { Tabs } from "@mantine/core";
import classes from "./tabs.module.css";
import UsersTable from "../../../../components/screens/Dashboards/Admin/UsersTable";
import EmptyState from "../../../../components/EmptyState";

function UsersTab({ users }: { users: any }) {
  const [mainValue, setMainValue] = useState<string>("1");
  const [subValues, setSubValues] = useState<any>({
    "1": "all",
    "2": "all",
    "3": "all",
  });

  const roleFilteredUsers = useMemo(() => {
    switch (mainValue) {
      case "1":
        return users;
      case "2":
        return users.filter((u: any) => u.role === "tenant");
      case "3":
        return users.filter((u: any) => u.role === "landlord");
      default:
        return users;
    }
  }, [users, mainValue]);

  const statusFilteredUsers = useMemo(() => {
    const subValue = subValues[mainValue];
    switch (subValue) {
      case "all":
        return roleFilteredUsers;
      case "verified":
        return roleFilteredUsers.filter(
          (u: any) => u.is_verified && u.is_active
        );
      case "not-verified":
        return roleFilteredUsers.filter(
          (u: any) => !u.is_verified && u.is_active
        );
      case "suspended":
        return roleFilteredUsers.filter(
          (u: any) => u.is_suspended && !u.is_active
        );
      case "deleted":
        return roleFilteredUsers.filter(
          (u: any) => u.is_deleted && !u.is_active
        );
      default:
        return roleFilteredUsers;
    }
  }, [roleFilteredUsers, subValues, mainValue]);

  return (
    <>
      {users && users.length ? (
        <Tabs
          value={mainValue}
          onChange={(value) => {
            if (value !== null) setMainValue(value);
          }}
        >
          <Tabs.List className={classes.list}>
            <Tabs.Tab value="1" className={classes.tab}>
              All Users
            </Tabs.Tab>
            <Tabs.Tab value="2" className={classes.tab}>
              Tenants
            </Tabs.Tab>
            <Tabs.Tab value="3" className={classes.tab}>
              Property Owners
            </Tabs.Tab>
          </Tabs.List>

          {["1", "2", "3"].map((tabValue) => (
            <Tabs.Panel key={tabValue} value={tabValue}>
              <Tabs
                value={subValues[tabValue]}
                onChange={(val) =>
                  setSubValues((prev: any) => ({ ...prev, [tabValue]: val }))
                }
              >
                <Tabs.List>
                  <Tabs.Tab value="all">All</Tabs.Tab>
                  <Tabs.Tab value="verified">Verified</Tabs.Tab>
                  <Tabs.Tab value="not-verified">Not Verified</Tabs.Tab>
                  <Tabs.Tab value="suspended">Suspended</Tabs.Tab>
                  <Tabs.Tab value="deleted">Deleted</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={subValues[tabValue]}>
                  <UsersTable data={statusFilteredUsers} role={mainValue} />
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>
          ))}
        </Tabs>
      ) : (
        <EmptyState>
          <div className="space-y-4 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-semibold text-gray-800">
              No Users Registered
            </h2>
            <p className="text-sm text-gray-500">
              Looks like no user has registered
            </p>
          </div>
        </EmptyState>
      )}
    </>
  );
}

export default UsersTab;
