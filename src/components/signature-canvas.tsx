import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  value?: string;
  isPreviewMode?: boolean;
}

export function SignatureCanvasComponent({ onSignatureChange, value, isPreviewMode = false }: SignatureCanvasProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      if (signatureRef.current && containerRef.current) {
        const canvas = signatureRef.current.getCanvas();
        const containerWidth = containerRef.current.offsetWidth || 560;
        canvas.width = containerWidth;
        canvas.height = Math.max(150, containerWidth * 0.25);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (value && signatureRef.current && !!isPreviewMode) {
      signatureRef.current.fromDataURL(value);
    }
  }, [isPreviewMode, value]);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onSignatureChange("");
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL("image/png");
      onSignatureChange(dataURL);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Assinatura Digital</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="text-xs"
          >
            Limpar
          </Button>
        </div>
        
        <div
          ref={containerRef}
          className="border border-gray-300 rounded-lg relative px-4 py-2 outline-none bg-white w-full h-[120px] flex items-center justify-center"
        >
          <SignatureCanvas
            ref={signatureRef}
            onEnd={saveSignature}
            clearOnResize
            penColor="black"
            backgroundColor="white"
            canvasProps={{
              width: 400,
              height: 120,
              className: "signature-canvas w-full h-full",
              style: { 
                width: "100%", 
                height: "120px",
                touchAction: "none"
              }
            }}
          />
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Assine no campo acima usando o mouse, touchpad ou caneta digital
        </p>
      </div>
    </Card>
  );
}
