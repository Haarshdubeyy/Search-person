
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'
import { userFormSchema, UserFormData } from '@/app/actions/schemas'
import { updateUser, deleteUser } from '@/app/actions/actions'
import { UserForm } from './user-form'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  location?: string
}

interface UserCardProps {
  user: User
  onUpdate?: (updatedUser: User) => void
  onDelete?: (id: string) => void
}

export function UserCard({ user, onUpdate, onDelete }: UserCardProps) {
  //const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleUpdateUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const updatedUser = await updateUser(user.id, data)
      if (!updatedUser) throw new Error('User not found')

      onUpdate?.(updatedUser)
      //setIsEditing(false)

      toast({
        title: 'User Updated',
        description: `User ${updatedUser.name} was updated successfully.`,
        variant: 'default',
      })

      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser,
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: `Failed to update user.`,
        variant: 'destructive',
      })
      return {
        success: false,
        message: 'Failed to update user',
      }
    }
  }

  const handleDeleteUser = async (): Promise<void> => {
    try {
      const success = await deleteUser(user.id)
      if (success) {
        onDelete?.(user.id)

        toast({
          title: 'User Deleted',
          description: `User ${user.name} was deleted successfully.`,
          variant: 'default',
        })
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: `Failed to delete user.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">ID: {user.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{user.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <MutableDialog<UserFormData>
          formSchema={userFormSchema}
          FormComponent={UserForm}
          action={handleUpdateUser}
          addDialogTitle={`Edit User: ${user.name}`}
          dialogDescription="Update the user details below."
          submitButtonLabel="Save Changes"
          defaultValues={user}
          triggerButton={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          }
        />
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleDeleteUser}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

