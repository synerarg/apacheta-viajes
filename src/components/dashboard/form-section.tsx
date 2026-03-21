interface FormSectionProps {
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}

export function FormSection({ title, right, children }: FormSectionProps) {
  return (
    <div className="border border-primary bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-neutral-900">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  )
}
