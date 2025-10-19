"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface StudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  title: string;
}

export default function StudentsModal({
  isOpen,
  onClose,
  students,
  title,
}: StudentsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {students && students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student) => (
                <Card key={student.id} className="h-fit py-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum aluno encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


