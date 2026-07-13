
Create a Role

resize-image-role



add policy
1. AWSLambdaBasicExecutionRole  (default policy) Edit policy json -> next

{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "logs:CreateLogGroup",
			"Resource": "arn:aws:logs:us-east-1:<ACCOUNT_ID>:*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"logs:CreateLogStream",
				"logs:PutLogEvents"
			],
			"Resource": [
				"arn:aws:logs:us-east-1:<ACCOUNT_ID>:log-group:/aws/lambda/resize-image:*"
			]
		},
		{
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:GetObject",
				"s3:PutObjectAcl"
			],
			"Resource": "arn:aws:s3:::<BUCKET_NAME>/*"
		}
	]
}




2. policy-resize (add new policy)

    step 1. click on Add permissions -> Create inline policy -> click on JSON -> Add below policy json ->  click on Next

    {
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:ListBucket"
			],
			"Resource": "arn:aws:s3:::<BUCKET_NAME>"
		},
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": "arn:aws:s3:::<BUCKET_NAME>/*"
		}
	]
}
