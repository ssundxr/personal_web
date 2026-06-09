'use client'

export default function DeleteButton({
  className,
  confirmMessage = 'Are you sure you want to delete this?',
  children = 'Delete'
}: {
  className?: string
  confirmMessage?: string
  children?: React.ReactNode
}) {
  return (
    <button 
      type="submit" 
      className={className}
      onClick={(e) => { 
        if (!window.confirm(confirmMessage)) {
          e.preventDefault() 
        }
      }}
    >
      {children}
    </button>
  )
}
