<script lang="ts">
  import LoginCheck from '../../../components/LoginCheck.svelte';
  import Loader from '../../../components/Loader.svelte';
  import {Datatable, rows} from 'svelte-simple-datatables';
  import {questions, load} from '../../../../stores/questions';
  import {link} from 'svelte-spa-router';
  import { loggedIn } from '../../../../stores/current_user';
  import { onMount } from 'svelte';
  import {_} from 'svelte-i18n';

  $: if($loggedIn) {
    load();
  }

  onMount(() => {
    load();
  });

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
    labels: {
        search: $_('search'),    // search input placeholer
        filter: $_('filter'),       // filter inputs placeholder
        noRows: $_('no_entries'),
        info: $_('datatable_meta'),
        previous: $_('previous'),
        next: $_('next'),       
    }
  };

  let tRows: { id: number, question_de: string}[] = [];
  $: tRows = $rows;

</script>
<LoginCheck>
  {#if $questions}
  <div class="datatable-question">
    <Datatable settings={tableSettings} data={$questions}>
      <thead>
        <th class="sortable asc desc" data-key="id">ID</th>
        <th class="sortable asc desc" data-key="question">{$_('question')}</th>
        <th></th>
      </thead>
      <tbody>
      {#each tRows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.question_de}</td>
              <td>
                <ul class="action-list">
                  <li><a href="/admin/questions/details/{row.id}" use:link><span class="icon edit">Edit</span></a></li>
                  <li><a href="/admin/questions/delete/{row.id}" use:link><span class="icon delete">Delete</span></a></li>
                  <li><a href="/admin/questions/cluster/{row.id}" use:link><span class="icon cluster">Cluster</span></a></li>
                </ul>
              </td>
          </tr>
      {/each}
      </tbody>
    </Datatable>
  </div>
  {:else}
  <Loader />
  {/if}
</LoginCheck>