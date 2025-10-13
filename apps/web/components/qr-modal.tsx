'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Share2, Copy, CheckCircle } from 'lucide-react';

interface QrModalProps {
  dealSlug: string;
  dealTitle: string;
}

export function QrModal({ dealSlug, dealTitle }: QrModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const dealUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/d/${dealSlug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dealUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Deal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Share Deal"
        size="sm"
      >
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeSVG value={dealUrl} size={200} level="H" />
            </div>
          </div>

          {/* Deal Title */}
          <div className="text-center">
            <p className="font-semibold text-gray-900">{dealTitle}</p>
            <p className="text-sm text-gray-500 mt-1">Scan to view deal</p>
          </div>

          {/* URL with Copy Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={dealUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="secondary"
                size="sm"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

