import { Pressable, Text, ActivityIndicator } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('flex-row items-center justify-center rounded-md', {
  variants: {
    variant: {
      primary: 'bg-interactive-primary active:bg-interactive-hover',
      secondary: 'bg-surface-base border border-border-base active:bg-surface-hover',
      ghost: 'bg-transparent active:bg-surface-hover',
      danger: 'bg-error active:bg-error/90',
    },
    size: {
      sm: 'h-8 px-3',
      md: 'h-10 px-4',
      lg: 'h-12 px-6',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

const buttonTextVariants = cva('font-medium', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-text-strong',
      ghost: 'text-text-strong',
      danger: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof Pressable>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size }),
        (disabled || loading) && 'opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : undefined}
          size="small"
        />
      ) : (
        <Text className={cn(buttonTextVariants({ variant, size }))}>{children}</Text>
      )}
    </Pressable>
  )
}
