# CAREN - Tutorial

In this tutorial, we detail the use of the CAREN webserver to design
antisense RNAs (asRNAs). We provide two examples:

 1. The design of asRNAs for all coding sequences in a genome, and
 1. The design of asRNAs for a user specified subset of coding sequences.

For both examples, we will use the Escherichia coli K-12 (MG1655)
genome. To get started, download the GenBank formatted version of the
genome from NCBI. Make sure to selected “GenBank (full)” under the
format menu (Figure 1). At the time of writing, the link for the most
recent version (NC_000913.3) is:
https://www.ncbi.nlm.nih.gov/nuccore/NC_000913.3

![Figure 1. Downloading the GenBank formatted genome from NCBI.](./tutorial1.png?raw=true "Figure 1. Downloading the GenBank formatted genome from NCBI.")

## Example 1. Design of asRNAs for all coding sequences.

In this example, we will design asRNAs for all coding sequences in the E. coli K-12 (MG1655) genome. See above for instructions on how to download the GenBank formatted genome file.

 1. Navigate your browser to the CAREN homepage: https://caren.carleton.ca
 1. Click “Choose File”, and upload the genome file.
 1. In the “Format” dropdown menu, select “genbank”.
 1. For this example, leave all settings at their defaults.
 1. Press “Run”.
 1. Job progress, as well as recent jobs, will be shown as below.
    ![Figure 2.](./tutorial2.png?raw=true)
 1. Press the “refresh” button (not your brower’s refresh button) to update job status.
 1. Download the result file.

## Example 2. Design of asRNAs for a subset of coding sequences. 

In this example, we will design asRNAs for a subset of coding
sequences in the E. coli K-12 (MG1655) genome. See above for
instructions on how to download the GenBank formatted genome file.

You will need to prepare a file listing which coding sequences
(“tags”) will be used. You can download a template file from the
Settings menu on the CAREN homepage:

![Figure 3.](./tutorial3.png?raw=true)

On the template, you need only fill out the Gene_Tag OR the Locus_Tag,
not both. For this example, we will design asRNAs for three gene tags:
gyrA, priA, and gyrB:

![Figure 4.](./tutorial4.png?raw=true)

Once you have obtained the source genome, and filled out the template,
follow these steps:

 1. Navigate your browser to the CAREN homepage: https://caren.carleton.ca 
 1. Click “Choose File”, and upload the genome file.
 1. In the “Format” dropdown menu, select “genbank”.
 1. Click the check box “Compute asRNAs only for these gene tags”.
 1. Upload your tag file using the “Choose File” button.
 1. For this example, leave all settings at their defaults.
 1. Press “Run”.
 1. Job progress, as well as recent jobs, will be shown as below.
    ![Figure 5.](./tutorial5.png?raw=true)
 1. Press the “refresh” button (not your brower’s refresh button) to update job status.
 1. Download the result file.
 
