"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

// Define schema for validation
const driverAssignSchema = z.object({
  transportType: z.string(),
  images: z.array(z.string()).optional(),
  type: z.string(),
  finalImage: z.string().optional(),
});

export const DriverAssignForm = ({ carPlate }: { carPlate: string }) => {
  //   const [taskType, setTaskType] = useState<"PICKUP" | "DROPOFF" | undefined>(
  //     undefined
  //   );

  const [frontImg, setFrontImg] = useState<string | null>(null);

  // Create a ref for the video element and canvas element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const form = useForm<z.infer<typeof driverAssignSchema>>({
    resolver: zodResolver(driverAssignSchema),
    defaultValues: {
      transportType: "",
      images: [""],
      finalImage: "",
      type: "",
    },
  });

  // Watch `type` field value from the form
  const formType = form.watch("type");

  const { isSubmitting } = form.formState;
  const router = useRouter();

  // Handle form submission
  async function onSubmit(data: z.infer<typeof driverAssignSchema>) {
    try {
      console.log(data); // This will log the form data
      toast.success("Assignment saved successfully!");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  // Start the camera feed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not access camera.");
    }
  };

  // Capture an image from the camera feed
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");

      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Convert the canvas image to a data URL and set it to frontImg state
        const imageUrl = canvasRef.current.toDataURL();
        setFrontImg(imageUrl);

        // Optionally, you can stop the camera stream here
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop the video stream
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Car Plate Input */}
        <Input placeholder={carPlate} disabled />

        {/* Task Type Dropdown */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">Pick up</SelectItem>
                    <SelectItem value="DROPOFF">Drop off</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formType === "PICKUP" && (
          <FormField
            control={form.control}
            name="transportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transportation Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transportation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Button to open the camera and capture the image */}
        <Button type="button" onClick={startCamera}>
          Open Camera
        </Button>
        <Button type="button" onClick={captureImage}>
          Capture Front Image
        </Button>

        {/* Video Feed (Camera Preview) */}
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%"
            height="auto"
            style={{ display: frontImg ? "none" : "block" }}
          />
        </div>

        {/* Canvas to draw the captured image */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Display the captured front image */}
        {frontImg && (
          <div>
            <Image
              src={frontImg}
              alt="Captured Front Image"
              width={200}
              height={200}
            />
          </div>
        )}

        {/* Images Input Field */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter image URL or file"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};
