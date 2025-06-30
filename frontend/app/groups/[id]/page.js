import { GroupDetails } from "@/app/components/groups/groupDetails";

export default async function GroupOpned(props) {
  const params = await props.params;

  return (
    <div>
      <GroupDetails id={params.id} />
    </div>
  );
}
