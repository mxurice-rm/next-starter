import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import EasyForm from '@/components/form/easy-form'

const Page = () => {
  return (
    <div className="my-10 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>EasyForm</CardTitle>
          <CardDescription>React Tanstack form system</CardDescription>
        </CardHeader>
        <CardContent>
          <EasyForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
