import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "../ui/textarea";
import { UserValidationSchema } from "@/lib/validation";
import { Models } from "appwrite";
import { toast } from "../ui/use-toast";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import AvatarUploader from "../shared/AvatarUploader";

type ProfileFormProps = {
  user?: Models.Document;
  action: "Update";
};
const ProfileForm = ({ user, action }: ProfileFormProps) => {
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserValidationSchema>>({
    resolver: zodResolver(UserValidationSchema),
    defaultValues: {
      file: [],
      name: user ? user?.name : "",
      username: user ? user?.username : "",
      email: user ? user?.email : "",
      bio: user ? user?.bio : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserValidationSchema>) {
    if (user && action === "Update") {
      const updatedUser = await updateUser({
        ...values,
        userId: user.$id,
        imageId: user?.imageId,
        imageUrl: user?.imageUrl,
      });

      if (!updatedUser) {
        toast({ title: "Please try again!" });
      } else {
        return navigate(`/profile/${user.$id}`);
      }
    }

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarUploader
                  fieldChange={field.onChange}
                  mediaUrl={user?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate ? "Loading " : "Update"} Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
