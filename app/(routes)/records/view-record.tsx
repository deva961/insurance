"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssignmentData } from "./columns";

export const ViewRecord = ({ data }: { data: AssignmentData }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg capitalize">
          Agent: {data.driver.user.name}
        </h1>
        {/* <p className="text-sm ">{data.status}</p> */}
      </div>
      {data.customerName && (
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            readOnly
            id="customerName"
            autoFocus={false}
            className="focus:select-none"
            value={data.customerName}
          />
        </div>
      )}
      {data.customerPhone && (
        <div>
          <Label htmlFor="customerName">Customer Phone</Label>
          <Input
            readOnly
            id="customerPhone"
            autoFocus={false}
            className="focus:select-none"
            value={data.customerPhone}
          />
        </div>
      )}

      {data.amount && (
        <div>
          <Label htmlFor="customerName">Amount</Label>
          <Input
            readOnly
            id="amount"
            autoFocus={false}
            className="focus:select-none"
            value={data.amount}
          />
        </div>
      )}

      {data.startAddress && (
        <div>
          <Label htmlFor="customerName">Start Address</Label>
          <Input
            readOnly
            id="startAddress"
            autoFocus={false}
            className="focus:select-none"
            value={data.startAddress}
          />
        </div>
      )}

      {data.collectedAddress && (
        <div>
          <Label htmlFor="customerName">Collected Address</Label>
          <Input
            readOnly
            id="collectedAddress"
            autoFocus={false}
            className="focus:select-none"
            value={data.collectedAddress}
          />
        </div>
      )}
    </div>
  );
};
