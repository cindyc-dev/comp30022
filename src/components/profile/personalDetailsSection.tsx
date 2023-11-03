import { useEffect, useState } from "react";
import { AvatarImage } from "~/components/common/avatarImage";
import { TextInput } from "~/components/common/textInput";
import { useModal } from "~/components/hooks/modalContext";
import { useToast } from "~/components/hooks/toastContext";
import { api } from "~/utils/api";
import UploadImageModalContent from "~/components/common/uploadImageModalContent";
import { DEFAULT_PROFILE_PIC } from "~/sample_data/sampleConnections";

export const PersonalDetailsSection = () => {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_PIC);

  const { openModal } = useModal();
  const { addToast } = useToast();

  const { data: profileDetails, refetch } = api.details.profile.useQuery();

  useEffect(() => {
    if (profileDetails) {
      setName(profileDetails.name);
      profileDetails.contact && setContact(profileDetails.contact);
      setEmail(profileDetails.email);
      if (profileDetails.image) {
        setProfileImage(profileDetails.image);
      } else {
        setProfileImage(DEFAULT_PROFILE_PIC);
      }
    }
  }, [profileDetails]);

  const mutation = api.details.setProfile.useMutation();
  const savePersonalDetails = () => {
    if (!name || !email) {
      // Show error toast
      addToast({
        type: "error",
        message: "Name and Email are required.",
      });
      return;
    }

    const profile = {
      name: name,
      contact: contact,
      email: email,
    };

    mutation.mutate(profile, {
      onSuccess: async () => {
        addToast({
          type: "success",
          message: "Profile details saved successfully.",
        });
        refetch();
      },
      onError: async (error) => {
        addToast({
          type: "error",
          message: `${error.data?.httpStatus} ${error.data?.code}: ${error.message}`,
        });
      },
    });
  };

  const imageMutation = api.details.setImage.useMutation();
  const editPhoto = () => {
    openModal({
      content: (
        <UploadImageModalContent
          onSaveImage={(imageUrl) => {
            const image = {
              newImage: imageUrl,
            };
            imageMutation.mutate(image, {
              onSuccess: async () => {
                addToast({
                  type: "success",
                  message: "Profile picture saved successfully.",
                });
              },
            });
          }}
        />
      ),
      id: "upload-image-modal",
    });
  };

  return (
    <>
      <div className="flex flex-col justify-between align-middle md:flex-row md:gap-5">
        <div>
          <h2 className="m-0">Personal details</h2>
          <p className="m-0 text-sm">
            Personal details will appear as public on your account page. You may
            have to refresh the page to see the changes.
          </p>
        </div>
        <div className="hidden flex-row gap-2 md:flex">
          <button
            className="btn btn-primary"
            onClick={() => savePersonalDetails()}
          >
            Save changes
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 align-middle md:flex-row md:justify-between">
        <div className="flex flex-col text-center">
          <label
            className="avatar btn btn-circle btn-ghost h-40 w-40"
            onClick={() => editPhoto()}
          >
            <AvatarImage src={profileImage} />
          </label>
          <p
            className="link cursor-pointer text-xs"
            onClick={() => editPhoto()}
          >
            Edit Photo
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <TextInput
            label="Name"
            value={name}
            setValue={setName}
            placeholder="eg. John Green"
            required={true}
          />
          <TextInput
            label="Email"
            value={email}
            setValue={setEmail}
            placeholder="eg. example@company.com"
            type="email"
            required={true}
          />
          <TextInput
            label="Contact"
            value={contact}
            setValue={setContact}
            placeholder="eg. 012-3456789"
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button
          className="btn btn-primary flex-grow md:hidden"
          onClick={() => savePersonalDetails()}
        >
          Save changes
        </button>
      </div>
    </>
  );
};

export default PersonalDetailsSection;
