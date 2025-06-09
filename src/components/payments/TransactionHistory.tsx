import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw } from "lucide-react";
import { PaymentRecord, getStatusBadgeVariant } from "@/types/payment";

interface TransactionHistoryProps {
  transactions: PaymentRecord[];
  onRefresh?: () => void;
}

export default function TransactionHistory({ transactions, onRefresh }: TransactionHistoryProps) {
  const { toast } = useToast();
  const [isRefunding, setIsRefunding] = useState<string | null>(null);

  const handleRefund = async (paymentId: string) => {
    try {
      setIsRefunding(paymentId);
      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_id: paymentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process refund');
      }

      const result = await response.json();
      toast({
        title: "Refund Initiated",
        description: "Your refund request has been processed successfully.",
      });

      // Refresh the transaction list
      onRefresh?.();

    } catch (error) {
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setIsRefunding(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {formatCurrency(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
                {transaction.refund_id && (
                  <div className="text-xs text-gray-500 mt-1">
                    Refunded: {new Date(transaction.refunded_at!).toLocaleDateString()}
                    <br />
                    Refund ID: <span className="font-mono">{transaction.refund_id}</span>
                    {transaction.refund_notes && (
                      <>
                        <br />
                        Reason: {transaction.refund_notes}
                      </>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>{transaction.payment_method}</TableCell>
              <TableCell>
                {transaction.status === 'captured' && !transaction.refund_id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isRefunding === transaction.payment_id}
                      >
                        {isRefunding === transaction.payment_id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Refund'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Refund</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to refund this payment of{' '}
                          {formatCurrency(transaction.amount, transaction.currency)}?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRefund(transaction.payment_id)}
                        >
                          Confirm Refund
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
}