import { Component, OnInit as % if (!!viewEncapsulation) { %>, ViewEncapsulation <% }%> as % if (changeDetection !== 'Default') { %>, ChangeDetectionStrategy <% }%> } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.component.html',<% if (!inlineStyle) { %> as % } else { %>
    styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>'] <% } %> as % if (!!viewEncapsulation) { %>,
      encapsulation: ViewEncapsulation.<%= viewEncapsulation %> as % } if (changeDetection !== 'Default') { %>,
        changeDetection: ChangeDetectionStrategy.<%= changeDetection %> as % } %>
})
export class <%= componentName %> implements OnInit {

  constructor(private http: _HttpClient, private msg: NzMessageService) { }

  ngOnInit() { }

}
